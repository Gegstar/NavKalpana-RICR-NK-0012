"use client";

import React from "react";
import { Typography, Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Stack } from "@mui/material";
import { Award, Trophy } from "lucide-react";

interface Scorer {
  name: string;
  score: number;
  rank: number;
}

export default function RankLeaderboard({ scorers }: { scorers?: Scorer[] }) {
  const defaultScorers = scorers || [
    { name: "John Doe", score: 4500, rank: 1 },
    { name: "Jane Smith", score: 4200, rank: 2 },
    { name: "Mike Johnson", score: 3900, rank: 3 }
  ];

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Trophy size={20} color="var(--primary-yellow)" />
        <Typography variant="h6" fontWeight="bold">Leaderboard</Typography>
      </Stack>

      <List sx={{ p: 0 }}>
        {defaultScorers.map((user, i) => (
          <ListItem
            key={i}
            sx={{
              px: 2,
              py: 1,
              mb: 1,
              bgcolor: 'var(--bg-light)',
              borderRadius: 2,
              border: '1px solid var(--border-light)',
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateX(4px)', bgcolor: 'var(--bg-white)', borderColor: 'var(--primary-yellow)' }
            }}
          >
            <ListItemAvatar sx={{ minWidth: 48 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=FDE68A&color=000`} 
                  sx={{ width: 32, height: 32 }}
                />
                {user.rank <= 3 && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -6, 
                    right: -6, 
                    bgcolor: 'var(--bg-white)', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    p: 0.2 
                  }}>
                    <Award 
                      size={12} 
                      color={user.rank === 1 ? 'var(--primary-yellow)' : 'var(--text-muted)'} 
                    />
                  </Box>
                )}
              </Box>
            </ListItemAvatar>
            <ListItemText
              primary={<Typography variant="subtitle2" fontWeight="bold">{user.name}</Typography>}
              secondary={<Typography variant="caption" color="text.secondary">Rank #{user.rank} • {user.score} XP</Typography>}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
