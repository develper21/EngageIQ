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
            select: {
                timestamp: true,
                engagementRate: true
            }
        });

        const youtubeVideos = await prisma.youTubeVideo.findMany({
            where: {
                account: { userId: user.id },
                publishedAt: { gte: startDate }
            },
            select: {
                publishedAt: true,
                engagementRate: true
            }
        });

        const twitterTweets = await prisma.twitterTweet.findMany({
            where: {
                account: { userId: user.id },
                createdAt: { gte: startDate }
            },
            select: {
                createdAt: true,
                engagementRate: true
            }
        });

        const allPosts = [
            ...instagramPosts.map(post => ({ time: post.timestamp, engagement: post.engagementRate })),
            ...youtubeVideos.map(video => ({ time: video.publishedAt, engagement: video.engagementRate })),
            ...twitterTweets.map(tweet => ({ time: tweet.createdAt, engagement: tweet.engagementRate }))
        ];

        const hourlyEngagement = new Array(24).fill(0).map(() => ({ hour: 0, totalEngagement: 0, count: 0 }));
        const dailyEngagement = new Array(7).fill(0).map(() => ({ day: 0, totalEngagement: 0, count: 0 }));

        if (allPosts.length > 0) {
            allPosts.forEach(post => {
                const hour = post.time.getHours();
                const day = post.time.getDay();

                hourlyEngagement[hour].hour = hour;
                hourlyEngagement[hour].totalEngagement += post.engagement;
                hourlyEngagement[hour].count += 1;

                dailyEngagement[day].day = day;
                dailyEngagement[day].totalEngagement += post.engagement;
                dailyEngagement[day].count += 1;
            });
        }

        const bestHour = hourlyEngagement
            .map(h => ({ hour: h.hour, avgEngagement: h.count > 0 ? h.totalEngagement / h.count : 0 }))
            .sort((a, b) => b.avgEngagement - a.avgEngagement)[0];

        const bestDay = dailyEngagement
            .map(d => ({ day: d.day, avgEngagement: d.count > 0 ? d.totalEngagement / d.count : 0 }))
            .sort((a, b) => b.avgEngagement - a.avgEngagement)[0];

        return NextResponse.json({
            bestTime: {
                hour: bestHour?.hour || 12,
                day: bestDay?.day || 1,
                hourlyData: hourlyEngagement.map(h => ({ hour: h.hour, avgEngagement: h.count > 0 ? h.totalEngagement / h.count : 0 })),
                dailyData: dailyEngagement.map(d => ({ day: d.day, avgEngagement: d.count > 0 ? d.totalEngagement / d.count : 0 }))
            }
        });

    } catch (error) {
        console.error('Best time analysis error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
