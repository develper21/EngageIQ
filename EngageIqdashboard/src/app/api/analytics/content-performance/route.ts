import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const timeframe = searchParams.get('timeframe') || '30d';

        const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const instagramPosts = await prisma.instagramPost.findMany({
            where: {
                account: { userId: user.id },
                timestamp: { gte: startDate }
            },
            orderBy: { engagementRate: 'desc' },
            take: 10
        });

        const youtubeVideos = await prisma.youTubeVideo.findMany({
            where: {
                account: { userId: user.id },
                publishedAt: { gte: startDate }
            },
            orderBy: { engagementRate: 'desc' },
            take: 10
        });

        const twitterTweets = await prisma.twitterTweet.findMany({
            where: {
                account: { userId: user.id },
                createdAt: { gte: startDate }
            },
            orderBy: { engagementRate: 'desc' },
            take: 10
        });

        const topContent = [
            ...instagramPosts.map(post => ({
                id: post.id,
                platform: 'instagram',
                type: post.mediaType,
                title: post.caption || 'No caption',
                engagement: post.engagementRate,
                likes: post.likesCount,
                comments: post.commentsCount,
                shares: post.sharesCount,
                date: post.timestamp,
                url: post.permalink
            })),
            ...youtubeVideos.map(video => ({
                id: video.id,
                platform: 'youtube',
                type: 'video',
                title: video.title,
                engagement: video.engagementRate,
                likes: video.likesCount,
                comments: video.commentsCount,
                shares: video.sharesCount,
                views: video.viewsCount,
                date: video.publishedAt,
                thumbnail: video.thumbnailUrl
            })),
            ...twitterTweets.map(tweet => ({
                id: tweet.id,
                platform: 'twitter',
                type: 'tweet',
                title: tweet.text || 'No text',
                engagement: tweet.engagementRate,
                likes: tweet.likesCount,
                comments: tweet.repliesCount,
                shares: tweet.retweetsCount,
                date: tweet.createdAt
            }))
        ].sort((a, b) => b.engagement - a.engagement).slice(0, 10);

        return NextResponse.json({ topContent });

    } catch (error) {
        console.error('Content performance error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
