import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/SocketProvider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        }
      }, { skipNull: true });

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }

      return res.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error; // Let react-query handle the error state
    }
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey,],
    //@ts-ignore
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: isConnected ? false : 1000,
    initialPageParam: null as string | null,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
