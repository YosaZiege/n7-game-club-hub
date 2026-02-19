"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type GameRow = {
  id: string;
  title: string;
  approved: boolean;
  createdAt: Date;
  creator: { username: string | null };
};

export default function DelegueTable({ initialGames }: { initialGames: GameRow[] }) {
  const [games, setGames] = useState(initialGames);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function approveGame(id: string, approved: boolean) {
  setLoadingId(id);
  try {
    const res = await fetch(`/api/approve/game/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });

    if (!res.ok) throw new Error("Update failed");

    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, approved } : g))
    );
  } finally {
    setLoadingId(null);
  }
}

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell className="font-medium">{game.title}</TableCell>
              <TableCell>{game.creator?.username ?? "Unknown"}</TableCell>
              <TableCell>
                {game.approved ? (
                  <Badge className="bg-green-500">Approved</Badge>
                ) : (
                  <Badge variant="secondary">Pending</Badge>
                )}
              </TableCell>
              <TableCell>
                {new Date(game.createdAt).toLocaleDateString()}
              </TableCell>
             <TableCell className="text-right">
  {game.approved ? (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => approveGame(game.id, false)}
      disabled={loadingId === game.id}
    >
      {loadingId === game.id ? "Updating..." : "Unapprove"}
    </Button>
  ) : (
    <Button
      size="sm"
      onClick={() => approveGame(game.id, true)}
      disabled={loadingId === game.id}
    >
      {loadingId === game.id ? "Updating..." : "Approve"}
    </Button>
  )}
</TableCell>
            </TableRow>
          ))}

          {games.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No games found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

