import { useRouter } from 'next/router';
import { Rate, Progress } from 'antd';
import { Img } from '@/components/ui/img';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import useLearnProgress from '@/hooks/useLearnProgress';

interface LearnHeaderProps {
  slug: string;
}

export default function LearnHeader({ slug }: LearnHeaderProps) {
  const router = useRouter();
  const { learnProgress, isLoading } = useLearnProgress(slug);

  return (
    <>
      {isLoading ? (
        <></>
      ) : (
        <header className="w-full bg-blue_gray-primary shadow-lg">
          <div className="w-[95%] flex mx-auto items-center justify-between gap-5 my-[10px]">
            <div className="flex items-center justify-center gap-4 z-50">
              <div className="flex items-center justify-center md:w-full pr-2">
                <Img
                  src="/images/img_refresh_cyan_a200.svg"
                  alt="refresh_one"
                  className="h-[44px] w-[44px] rounded-md"
                />
                <Heading
                  size="2xl"
                  as="h2"
                  className="relative ml-[-36px] tracking-[1.28px] !text-white-primary cursor-pointer"
                  onClick={() => router.push('/')}
                >
                  HoaLearn
                </Heading>
              </div>
              <div className="w-[1px] h-[28px] bg-white-primary"></div>
              <div>
                <Heading size="lg" className="!font-medium !text-white-primary">
                  {learnProgress?.data?.course.title}
                </Heading>
              </div>
            </div>
            <div className="flex items-center justify-end gap-6 z-50">
              <Button size="sm" variant={'ghost'} className="text-tx !text-white-primary">
                <Rate className="text-sm text-gray-400 mr-2" count={1} defaultValue={1} />
                {learnProgress?.data?.review ? 'Edit your rating' : 'Leave a rating'}
              </Button>
              <Text size="tx" className="!font-medium !text-white-primary inline-flex items-center gap-2">
                <Progress
                  className="circle-progess"
                  size={40}
                  type="circle"
                  percent={learnProgress?.data?.progressStatus}
                />
                Your progress
              </Text>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
