import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import type { GraphEmbed } from '../types/embeds';
import {
  createGraphBoard,
  destroyBoard,
  syncBoardViewport,
  type JxgBoard,
} from '../utils/graphBoard';
import { isDisplayInteractive } from '../utils/graphMode';
import { graphPreviewKey } from '../utils/graphPreviewKey';

export type GraphRendererProps = {
  embed: GraphEmbed;
  /** Override interactivity (defaults from embed.mode). */
  interactive?: boolean;
  height?: number | string;
  width?: number | string;
  className?: string;
};

const GraphRenderer: React.FC<GraphRendererProps> = ({
  embed,
  interactive,
  height = 320,
  width,
  className,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<JxgBoard | null>(null);
  const lastBoardSizeRef = useRef({ width: 0, height: 0 });
  const embedRef = useRef(embed);
  const [error, setError] = useState<string | null>(null);

  embedRef.current = embed;

  const isInteractive = interactive ?? isDisplayInteractive(embed);

  const embedKey = graphPreviewKey(embed);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const el = containerRef.current;
    if (!wrapper || !el) return;

    let cancelled = false;
    let resizeRaf = 0;
    setError(null);
    lastBoardSizeRef.current = { width: 0, height: 0 };

    const applyBoardSize = (width: number, h: number) => {
      const last = lastBoardSizeRef.current;
      if (
        boardRef.current &&
        Math.abs(width - last.width) < 2 &&
        Math.abs(h - last.height) < 2
      ) {
        return;
      }
      lastBoardSizeRef.current = { width, height: h };

      if (boardRef.current) {
        boardRef.current.resizeContainer(width, h);
        syncBoardViewport(boardRef.current, embedRef.current, width, h);
        boardRef.current.update();
        return;
      }

      createGraphBoard({
        container: el,
        embed: embedRef.current,
        interactive: isInteractive,
        width,
        height: h,
      })
        .then((board) => {
          if (cancelled) {
            destroyBoard(board);
            return;
          }
          boardRef.current = board;
          board.resizeContainer(width, h);
          syncBoardViewport(board, embedRef.current, width, h);
          board.update();
        })
        .catch((err) => {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Failed to load graph');
          }
        });
    };

    let zeroSizeRetries = 0;
    const MAX_ZERO_SIZE_RETRIES = 24;

    const syncBoardSize = () => {
      if (cancelled) return;
      const width = Math.round(wrapper.clientWidth);
      const plotHeight =
        typeof height === 'number'
          ? height
          : Math.round(wrapper.clientHeight);
      if (width < 2 || plotHeight < 2) {
        if (zeroSizeRetries < MAX_ZERO_SIZE_RETRIES) {
          zeroSizeRetries += 1;
          cancelAnimationFrame(resizeRaf);
          resizeRaf = requestAnimationFrame(syncBoardSize);
        }
        return;
      }
      zeroSizeRetries = 0;
      applyBoardSize(width, plotHeight);
    };

    const scheduleSync = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        requestAnimationFrame(syncBoardSize);
      });
    };

    scheduleSync();

    const resizeObserver = new ResizeObserver(scheduleSync);
    resizeObserver.observe(wrapper);

    return () => {
      cancelled = true;
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      lastBoardSizeRef.current = { width: 0, height: 0 };
      destroyBoard(boardRef.current);
      boardRef.current = null;
    };
  }, [embedKey, isInteractive, height, width]);

  return (
    <Box
      ref={wrapperRef}
      className={`graph-embed-renderer ${className ?? ''}`.trim()}
      sx={{
        width: width ?? '100%',
        height,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      <Box
        ref={containerRef}
        className="jsxgraph-board-container"
        sx={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
      />
      {error && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'error.main',
            fontSize: '0.875rem',
            p: 2,
          }}
        >
          {error}
        </Box>
      )}
    </Box>
  );
};

export default GraphRenderer;
