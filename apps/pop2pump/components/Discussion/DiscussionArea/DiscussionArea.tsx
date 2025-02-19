import { Textarea } from "@nextui-org/react";
import { Button } from "@/components/button/button-next";
import { CommentCard } from "../CommentCard/CommentCard";
import CardContianer from "@/components/CardContianer/CardContianer";
import Image from "next/image";
import { trpcClient } from "@/lib/trpc";
import { wallet } from "@/services/wallet";
import { useEffect, useState } from "react";
import { LoadingDisplay } from "@/components/LoadingDisplay/LoadingDisplay";
import { useRouter } from "next/router";
import { cn } from "@/lib/tailwindcss";
import dayjs from "dayjs";
import { WrappedToastify } from "@/lib/wrappedToastify";

interface DiscussionAreaProps {
  pairDatabaseId: number;
  isSide?: boolean;
  classNames?: {
    container?: string;
  };
}

export function DiscussionArea(props: DiscussionAreaProps) {
  const router = useRouter();
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState<
    {
      id: number;
      project_id: number;
      commenter: string;
      comment: string;
      is_owner: boolean;
      parent_comment_id: number | null;
      created_at_unix: number;
      updated_at_unix: number;
    }[]
  >([]);
  const [state, setState] = useState({
    loadingComments: false,
    commenting: false,
    noMoreToLoad: false,
    loadingMore: false,
  });

  useEffect(() => {
    if (!props.pairDatabaseId) return;
    startFetchComments();
  }, [props.pairDatabaseId]);

  const startFetchComments = async () => {
    setState({
      ...state,
      loadingComments: true,
    });
    const res = await trpcClient.discussionRouter.getCommentsByProjectId.query({
      project_id: props.pairDatabaseId ?? -1,
      limit: 10,
    });

    if (res) {
      setComments(res);
      setState({
        ...state,
        loadingComments: false,
        noMoreToLoad: res.length < 10,
      });
      continueFetchComments(res?.[0]?.id ?? 0);
    }
  };

  const continueFetchComments = async (afterId: number) => {
    const res = await trpcClient.discussionRouter.getCommentsByProjectId.query({
      project_id: props.pairDatabaseId ?? -1,
      afterId: afterId,
    });

    if (res && res.length > 0) {
      setComments((prev) => {
        const newArr = [...res, ...prev];
        return newArr;
      });
    }

    setTimeout(() => {
      if (window.location.pathname !== router.asPath.toString()) return;
      continueFetchComments(res?.[0]?.id ?? afterId);
    }, 2000);
  };

  const loadMoreComments = async () => {
    if (state.noMoreToLoad) return;
    setState({
      ...state,
      loadingMore: true,
    });
    const res = await trpcClient.discussionRouter.getCommentsByProjectId.query({
      project_id: props.pairDatabaseId ?? -1,
      beforeId: comments[comments.length - 1].id,
    });

    if (res && res.length > 0) {
      setComments((prev) => {
        const newArr = [...prev, ...res];
        return newArr;
      });
    } else {
      setState((prev) => {
        return {
          ...prev,
          noMoreToLoad: true,
        };
      });
    }

    setState((prev) => {
      return {
        ...prev,
        loadingMore: false,
      };
    });
  };

  return (
    <CardContianer
      addtionalClassName={cn(props.classNames?.container, "bg-[#202020]")}
    >
      <div
        className={cn(
          "flex-col w-full ",
          props.isSide &&
            " max-h-[100vh] grid grid-rows-[100px_300px_1fr] gap-2"
        )}
      >
        <h2 className="text-[2rem] font-bold">Discussion Board</h2>
        <div
          className={cn(
            "grid grid-cols-1 lg:grid-cols-[1fr_200px] w-full min-h-[300px] justify-center items-center",
            props.isSide && "!grid-cols-1"
          )}
        >
          <Textarea
            maxRows={15}
            label="Leave a Comment!"
            classNames={{
              base: "w-full h-full bg-[#262626] border border-[#FFCD4D] rounded-2xl overflow-hidden",
              inputWrapper: "w-full !h-full z-1",
              input: "w-full h-full",
              mainWrapper: "w-full h-full bg-[#2F200B] hover:bg-[#2F200B] z-1",
              label: "text-[#FFCD4D] text-base font-bold leading-[normal] z-1",
            }}
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          ></Textarea>
          <div className="flex gap-2 flex-col pl-5 justify-around items-center h-full">
            <Image
              className={cn(
                "hidden lg:block w-[200px]",
                props.isSide && "!hidden"
              )}
              src={"/images/bera/smoking_bera.png"}
              width={200}
              height={200}
              alt=""
            ></Image>{" "}
            <Button
              isDisabled={state.commenting}
              isLoading={state.commenting}
              onClick={async () => {
                if (!wallet.account) {
                  WrappedToastify.warn({
                    message: "Please connect your wallet",
                  });
                  return;
                }

                if (userComment.length === 0) {
                  WrappedToastify.warn({ message: "Comment can not be empty" });
                  return;
                }

                setState({
                  ...state,
                  commenting: true,
                });

                const res =
                  await trpcClient.discussionRouter.createComment.mutate({
                    project_id: props.pairDatabaseId ?? -1,
                    commenter: wallet.account,
                    comment: userComment,
                    is_owner: false,
                    parent_comment_id: undefined,
                  });

                if (res) {
                  setUserComment("");
                  WrappedToastify.success({ message: "Comment successfully" });
                } else {
                  WrappedToastify.error({ message: "Failed to comment" });
                }

                setState({
                  ...state,
                  commenting: false,
                });
              }}
            >
              Comment
            </Button>
          </div>
        </div>
        {state.loadingComments ? (
          <div className="w-full my-5">
            <LoadingDisplay />
          </div>
        ) : (
          <div
            className={cn("w-full my-2", props.isSide && "overflow-y-scroll")}
          >
            {/** comment cards */}
            {comments?.map((comment) => (
              <CommentCard
                key={comment.id}
                commenterImageURL="/images/bera/smoking_bera.png"
                commenterName={comment.commenter}
                commentDate={dayjs.unix(comment.created_at_unix).toDate()}
                comment={comment.comment}
              />
            ))}
          </div>
        )}
        {!state.noMoreToLoad && !state.loadingComments && (
          <div className="w-full flex justify-center items-center">
            <Button isLoading={state.loadingMore} onClick={loadMoreComments}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </CardContianer>
  );
}
