"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// import { Loading } from "@/components/auth/loading";
import { BoardCard } from "./_components/board-card";
import { EmptySearch } from "./_components/empty-search";
import { EmptyBoards } from "./_components/empty-boards";
import { EmptyFavorites } from "./_components/empty-favorites";
import { NewBoardButton } from "./_components/new-board-button";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorites?: string;
  };
}

export const BoardList = ({ orgId, query }: BoardListProps) => {
  const data = useQuery(api.boards.get, { orgId });
  // the data struct updated with a new field named ''isFavorite'' which append from boards.ts/ get func

  if (data === undefined) {
    return (
      <div>
        <h2 className="text-3xl">
          {query.favorites ? "Favorite boards" : "Team boards"}
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
      lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
          <NewBoardButton disabled orgId={orgId} />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
          <BoardCard.Skeleton />
        </div>
      </div>
    );
  }

  if (!data?.length && query.search) {
    return <EmptySearch />;
  }

  if (!data?.length && query.favorites) {
    return <EmptyFavorites />;
  }

  if (!data.length) {
    return <EmptyBoards />;
  }

  return (
    <div>
      <h2 className="text-3xl">
        {query.favorites ? "Favorite boards" : "Team boards"}
      </h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 
      lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5 mt-8 pb-10">
        <NewBoardButton orgId={orgId} />
        {data?.map((board) => {
          return (
            <BoardCard
              key={board._id}
              id={board._id}
              title={board.title}
              imageUrl={board.imageUrl}
              authorId={board.authorId}
              authorName={board.authorName}
              createAt={board._creationTime}
              orgId={board.orgId}
              isFavorite={board.isFavorite}
            />
          );
        })}
      </div>
    </div>
  );
};
