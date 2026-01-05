import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        // Note: To allow testing without a real user token in the earlier stages, 
        // we might want to skip this check or use a test user. 
        // However, strict implementation requires auth.
        // If running in dev without auth, this will return 401.

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const timeframe = searchParams.get('timeframe') || '30d';

        const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const instagramData = await prisma.instagramPost.findMany({
            where: {
                account: { userId: user.id },
                timestamp: { gte: startDate }
            },
            orderBy: { timestamp: 'desc' },
            take: 100
        });

        const youtubeData = await prisma.youTubeVideo.findMany({
            where: {
                account: { userId: user.id },
                publishedAt: { gte: startDate }
            },
            orderBy: { publishedAt: 'desc' },
            take: 100
        });

        const twitterData = await prisma.twitterTweet.findMany({
            where: {
                account: { userId: user.id },
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        const totalEngagement = {
            instagram: instagramData.reduce((sum, post) => sum + post.likesCount + post.commentsCount + post.sharesCount, 0),
            youtube: youtubeData.reduce((sum, video) => sum + video.likesCount + video.commentsCount, 0),
            twitter: twitterData.reduce((sum, tweet) => sum + tweet.likesCount + tweet.retweetsCount + tweet.repliesCount, 0)
        };

        const totalReach = {
            instagram: instagramData.reduce((sum, post) => sum + (post.reachCount || 0), 0),
            youtube: youtubeData.reduce((sum, video) => sum + video.viewsCount, 0),
            twitter: twitterData.reduce((sum, tweet) => sum + (tweet.viewsCount || 0), 0)
        };

        return NextResponse.json({
            timeframe,
            totalEngagement,
            totalReach,
            posts: {
                instagram: instagramData.length,
                youtube: youtubeData.length,
                twitter: twitterData.length
            }
        });

    } catch (error) {
        console.error('Analytics overview error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
