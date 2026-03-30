import React, { useState, useMemo, useEffect } from 'react'
import { Editor } from '@tiptap/react'
import {
  IconButton, Tooltip, Divider, Stack, Popover,
  Box, TextField, Button,
} from '@mui/material'

import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import TableChartIcon from '@mui/icons-material/TableChart'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CallMergeIcon from '@mui/icons-material/CallMerge'
import CallSplitIcon from '@mui/icons-material/CallSplit'
import QuizIcon from '@mui/icons-material/Quiz'
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft'
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter'
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight'

// NEW icon for equation
import FunctionsIcon from '@mui/icons-material/Functions';


interface Props {
  editor: Editor | null;
  showQuestionButton?: boolean;
  /** When provided, Equation button inserts inline math (e.g. empty placeholder) */
  onInsertEquation?: () => void;
  toolbarMode?: 'studentSimple' | 'tutorFull';
}

const MenuBar: React.FC<Props> = ({
  editor,
  showQuestionButton = false,
  onInsertEquation,
  toolbarMode = 'tutorFull',
}) => {
  // Move ALL hooks to the top, before any early returns
  const [, forceRerender] = useState(0)
  const [insertTableAnchorEl, setInsertTableAnchorEl] = useState<HTMLElement | null>(null)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  
  const e = editor as any;
// Then use: e.chain().focus().toggleItalic().run()
  useEffect(() => {
    if (!editor) return
    const rerender = () => forceRerender((x) => x + 1)
    editor.on('selectionUpdate', rerender)
    editor.on('transaction', rerender)
    return () => {
      editor.off('selectionUpdate', rerender)
      editor.off('transaction', rerender)
    }
  }, [editor])

  const hasQuestionExt = useMemo(
    () => editor ? !!editor.extensionManager.extensions.find((en) => en.name === 'question') : false,
    [editor]
  )

  const hasMathExt = useMemo(
    () => editor ? !!editor.extensionManager.extensions.find((en) => en.name === 'mathematics') : false,
    [editor]
  )

  // NOW do the early return after all hooks
  if (!editor) return null

  const FONT_SIZES = ['10px', '12px', '14px', '18px', '24px', '32px'] as const
  const currentFontSize = (editor.getAttributes('textStyle').fontSize as string | null) ?? ''
  const openInsertPopover = Boolean(insertTableAnchorEl)
  const closeInsertPopover = () => setInsertTableAnchorEl(null)

  // force rerender when selection/content changes so the dropdown reflects current selection

  const btn = (
    label: string,
    icon: React.ReactNode,
    onClick: () => void,
    active = false,
    disabled = false,
  ) => (
    <Tooltip key={label} title={label} arrow>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          color={active ? 'primary' : 'default'}
          sx={{ borderRadius: 1 }}
        >
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  )

  const handleInsertTable = () => {
    e.chain().focus()
      .insertTable({ rows: Math.max(1, rows), cols: Math.max(1, cols), withHeaderRow: true })
      .run()
    closeInsertPopover()
  }

  const insertQuestionPlaceholder = () => {
    if (!hasQuestionExt) return
    ;(editor.commands as any).insertQuestion?.(null)
  }

  // NEW: math insert

  const handleEquationClick = () => {
    if (onInsertEquation) {
      onInsertEquation()
      return
    }
    if (!hasMathExt) return
    ;(editor.chain().focus() as any).insertMath?.('')?.run?.()
      ?? (editor.commands as any).insertMath?.('')
  }

  const equationDisabled = !onInsertEquation && !hasMathExt
  const isStudentSimple = toolbarMode === 'studentSimple'
  const showAdvancedFormatting = !isStudentSimple
  const isInTable = editor.isActive('table')

  return (
    <>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ borderBottom: '1px solid #ddd', p: '4px 8px', bgcolor: '#fafafa', flexWrap: 'wrap' }}
      >
        {/* marks */}
        {btn('Bold', <FormatBoldIcon />, () => e.chain().focus().toggleBold().run(), editor.isActive('bold'))}
        {showAdvancedFormatting &&
          btn('Italic', <FormatItalicIcon />, () => e.chain().focus().toggleItalic().run(), editor.isActive('italic'))}
        {showAdvancedFormatting &&
          btn('Strike', <FormatStrikethroughIcon />, () => e.chain().focus().toggleStrike().run(), editor.isActive('strike'))}

        {/* Alignment */}
        {showAdvancedFormatting &&
          btn('Align Left', <FormatAlignLeftIcon />, () => e.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }))}
        {showAdvancedFormatting &&
          btn('Align Center', <FormatAlignCenterIcon />, () => e.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }))}
        {showAdvancedFormatting &&
          btn('Align Right', <FormatAlignRightIcon />, () => e.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }))}

        {/* lists */}
        {showAdvancedFormatting &&
          btn('Bullet', <FormatListBulletedIcon />, () => e.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'))}
        {showAdvancedFormatting &&
          btn('Numbered', <FormatListNumberedIcon />, () => e.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'))}

        {/* NEW: equation */}
        <Divider orientation="vertical" flexItem />
        <Tooltip key="Equation" title="Equation" arrow>
          <span>
            <IconButton
              size="small"
              onClick={handleEquationClick}
              disabled={equationDisabled}
              color="default"
              sx={{ borderRadius: 1 }}
            >
              <FunctionsIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Divider orientation="vertical" flexItem />

        <TextField
          select
          size="small"
          value={currentFontSize}
          onChange={(e) => {
            const value = e.target.value
            if (!value) (editor.chain().focus() as any).unsetFontSize?.().run?.()
            else (editor.chain().focus() as any).setFontSize?.(value).run?.()
          }}
          sx={{ width: 95 }}
          SelectProps={{ native: true }}
        >
          <option value="">16px</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </TextField>

        <Divider orientation="vertical" flexItem />

        {/* ⬇️ Only when enabled + extension present */}
        {showQuestionButton && hasQuestionExt &&
          btn('Insert question', <QuizIcon />, insertQuestionPlaceholder)
        }

        <Tooltip title="Insert table" arrow>
          <span>
            <IconButton
              size="small"
              onClick={(event) => setInsertTableAnchorEl(event.currentTarget)}
              color={isInTable ? 'primary' : 'default'}
              sx={{ borderRadius: 1 }}
            >
              <TableChartIcon />
            </IconButton>
          </span>
        </Tooltip>
        {isInTable && (
          <>
            {btn('Row ↑', <ArrowUpwardIcon fontSize="small" />, () => e.chain().focus().addRowBefore().run(), false, !e.can().addRowBefore())}
            {btn('Row ↓', <ArrowDownwardIcon fontSize="small" />, () => e.chain().focus().addRowAfter().run(), false, !e.can().addRowAfter())}
            {btn('Row ×', <TableRowsIcon fontSize="small" />, () => e.chain().focus().deleteRow().run(), false, !e.can().deleteRow())}

            <Divider orientation="vertical" flexItem />

            {btn('Col ←', <ArrowBackIcon fontSize="small" />, () => e.chain().focus().addColumnBefore().run(), false, !e.can().addColumnBefore())}
            {btn('Col →', <ArrowForwardIcon fontSize="small" />, () => e.chain().focus().addColumnAfter().run(), false, !e.can().addColumnAfter())}
            {btn('Col ×', <ViewColumnIcon fontSize="small" />, () => e.chain().focus().deleteColumn().run(), false, !e.can().deleteColumn())}

            <Divider orientation="vertical" flexItem />

            {btn('Merge', <CallMergeIcon fontSize="small" />, () => e.chain().focus().mergeCells().run(), false, !e.can().mergeCells())}
            {btn('Split', <CallSplitIcon fontSize="small" />, () => e.chain().focus().splitCell().run(), false, !e.can().splitCell())}
            {btn('Table ×', <DeleteForeverIcon />, () => e.chain().focus().deleteTable().run(), false, !e.can().deleteTable())}
          </>
        )}

        <Divider orientation="vertical" flexItem />

        {btn('Undo', <UndoIcon />, () => e.chain().focus().undo().run())}
        {btn('Redo', <RedoIcon />, () => e.chain().focus().redo().run())}
      </Stack>

      {/* table-size popover */}
      <Popover
        open={openInsertPopover}
        anchorEl={insertTableAnchorEl}
        onClose={closeInsertPopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            label="Rows"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 50 }}
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            sx={{ width: 120 }}
          />
          <TextField
            label="Cols"
            type="number"
            size="small"
            inputProps={{ min: 1, max: 20 }}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            sx={{ width: 120 }}
          />
          <Button variant="contained" size="small" onClick={handleInsertTable}>
            Insert
          </Button>
        </Box>
      </Popover>

    </>
  )
}

export default MenuBar