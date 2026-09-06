'use client'

import { useEffect, useState } from 'react'
import { Button, Heading, Text, Stack, Label, Flash, ProgressBar } from '@primer/react'
import {
  PaintbrushIcon,
  CheckCircleFillIcon,
  XCircleFillIcon,
  TrophyIcon,
  ZapIcon,
  StarFillIcon,
} from '@primer/octicons-react'
import { Graph } from './graph'
import { paintings, buildOptions, equationLabel } from '@/lib/paintings'

type Feedback = { kind: 'success' | 'error'; text: string } | null

export function LinePainterGame() {
  const [paintingIndex, setPaintingIndex] = useState(0)
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [lockedWrong, setLockedWrong] = useState<Set<string>>(new Set())
  const [allDone, setAllDone] = useState(false)

  const painting = paintings[paintingIndex]
  const drawn = painting.segments.slice(0, segmentIndex)
  const target = painting.segments[segmentIndex]
  const paintingComplete = segmentIndex >= painting.segments.length

  // Difficulty comes from the painting itself — later paintings introduce
  // curves (parabolas, circles, ellipses) rather than adding more choices.
  const difficulty = painting.difficulty

  // Options are shuffled with Math.random, so they're built client-side only
  // (in an effect) rather than during render — otherwise the server-rendered
  // order and the client's first render order would differ and React would
  // throw a hydration mismatch.
  const [options, setOptions] = useState<{ label: string; correct: boolean }[]>([])

  useEffect(() => {
    setOptions(target ? buildOptions(target, 4) : [])
  }, [paintingIndex, segmentIndex, target])

  function handlePick(label: string, correct: boolean) {
    if (!target || paintingComplete) return

    if (correct) {
      const gained = 100 + streak * 25
      setScore((s) => s + gained)
      setStreak((s) => s + 1)
      setFeedback({ kind: 'success', text: `Correct! ${equationLabel(target)} — +${gained} points` })
      setLockedWrong(new Set())
      setSegmentIndex((i) => i + 1)
    } else {
      setMistakes((m) => m + 1)
      setStreak(0)
      setLockedWrong((prev) => new Set(prev).add(label))
      setFeedback({ kind: 'error', text: `${label} doesn't match the dashed line. Try another.` })
    }
  }

  function nextPainting() {
    if (paintingIndex + 1 >= paintings.length) {
      setAllDone(true)
      return
    }
    setPaintingIndex((i) => i + 1)
    setSegmentIndex(0)
    setFeedback(null)
    setLockedWrong(new Set())
  }

  function restart() {
    setPaintingIndex(0)
    setSegmentIndex(0)
    setScore(0)
    setStreak(0)
    setMistakes(0)
    setFeedback(null)
    setLockedWrong(new Set())
    setAllDone(false)
  }

  const progress = Math.round((segmentIndex / painting.segments.length) * 100)

  return (
    <Stack direction="vertical" gap="normal">
      {/* Header */}
      <Stack direction="horizontal" justify="space-between" align="center" wrap="wrap" gap="normal">
        <Stack direction="horizontal" gap="condensed" align="center">
          <PaintbrushIcon size={28} />
          <Stack direction="vertical" gap="none">
            <Heading as="h1" variant="medium">
              Line Painter
            </Heading>
            <Text size="small" style={{ color: 'var(--fgColor-muted)' }}>
              Pick the equation that draws each line
            </Text>
          </Stack>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
          <Label size="large" variant="accent">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <StarFillIcon size={14} /> {score}
            </span>
          </Label>
          <Label size="large" variant={streak > 0 ? 'success' : 'secondary'}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <ZapIcon size={14} /> {streak}x
            </span>
          </Label>
          <Label size="large" variant={mistakes > 0 ? 'danger' : 'secondary'}>
            {mistakes} misses
          </Label>
        </Stack>
      </Stack>

      <div className="lp-grid">
        {/* Graph */}
        <Stack direction="vertical" gap="condensed">
          <Graph drawn={drawn} target={paintingComplete ? undefined : target} />
          <ProgressBar progress={progress} aria-label="Painting progress" />
        </Stack>

        {/* Controls */}
        <Stack direction="vertical" gap="normal">
          <div
            style={{
              padding: 16,
              borderRadius: 'var(--borderRadius-medium)',
              border: 'var(--borderWidth-thin) solid var(--borderColor-default)',
              background: 'var(--bgColor-muted)',
            }}
          >
            <Stack direction="vertical" gap="condensed">
              <Stack direction="horizontal" gap="condensed" align="center">
                <Label variant="secondary">
                  Painting {paintingIndex + 1} / {paintings.length}
                </Label>
                <Label variant="accent">
                  Line {Math.min(segmentIndex + 1, painting.segments.length)} /{' '}
                  {painting.segments.length}
                </Label>
                <Label
                  variant={
                    difficulty === 'Easy' ? 'success' : difficulty === 'Medium' ? 'attention' : 'danger'
                  }
                >
                  {difficulty}
                </Label>
              </Stack>
              <Heading as="h2" variant="medium">
                {painting.name}
              </Heading>
              <Text size="small" style={{ color: 'var(--fgColor-muted)' }}>
                {painting.hint}
              </Text>
            </Stack>
          </div>

          {feedback && (
            <Flash variant={feedback.kind === 'success' ? 'success' : 'danger'}>
              <Stack direction="horizontal" gap="condensed" align="center">
                {feedback.kind === 'success' ? (
                  <CheckCircleFillIcon />
                ) : (
                  <XCircleFillIcon />
                )}
                <Text size="small">{feedback.text}</Text>
              </Stack>
            </Flash>
          )}

          {!paintingComplete && (
            <Stack direction="vertical" gap="condensed">
              <Text size="small" style={{ color: 'var(--fgColor-muted)' }}>
                Which equation draws the dashed line?
              </Text>
              {options.map((opt) => {
                const wrong = lockedWrong.has(opt.label)
                return (
                  <Button
                    key={opt.label}
                    size="large"
                    disabled={wrong}
                    onClick={() => handlePick(opt.label, opt.correct)}
                    block
                    style={{ justifyContent: 'flex-start', fontFamily: 'var(--fontStack-monospace)' }}
                  >
                    {opt.label}
                  </Button>
                )
              })}
            </Stack>
          )}

          {paintingComplete && !allDone && (
            <Flash variant="success">
              <Stack direction="vertical" gap="condensed">
                <Stack direction="horizontal" gap="condensed" align="center">
                  <TrophyIcon />
                  <Text weight="semibold">You painted &ldquo;{painting.name}&rdquo;!</Text>
                </Stack>
                <Button variant="primary" size="large" onClick={nextPainting}>
                  {paintingIndex + 1 >= paintings.length ? 'See results' : 'Next painting'}
                </Button>
              </Stack>
            </Flash>
          )}
        </Stack>
      </div>

      {allDone && (
        <Flash variant="success">
          <Stack direction="vertical" gap="condensed">
            <Stack direction="horizontal" gap="condensed" align="center">
              <TrophyIcon size={20} />
              <Heading as="h2" variant="medium">
                Gallery complete!
              </Heading>
            </Stack>
            <Text>
              You finished every painting with a final score of {score} and {mistakes}{' '}
              {mistakes === 1 ? 'miss' : 'misses'}.
            </Text>
            <Button variant="primary" size="large" onClick={restart}>
              Play again
            </Button>
          </Stack>
        </Flash>
      )}
    </Stack>
  )
}
