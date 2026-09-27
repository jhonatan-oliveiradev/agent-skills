"use client";

/**
 * Adapted from https://www.ui-layouts.com/components/motion-drawer
 * MIT License — Copyright (c) 2024 UI LAYOUT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import * as React from "react";
import { Menu, X } from "lucide-react";
import { stackOutline } from "../lib/stack-outline";
import * as Dialog from "@radix-ui/react-dialog";
import { useDirection } from "@radix-ui/react-direction";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useDragControls,
  useIsPresent,
  type Transition,
} from "motion/react";
import { Button } from "./button";
import { ScrollArea, ElementScrollBar } from "@/registry/cojeev/ui/scroll-area";
import { cn } from "../lib/utils";
import { useMotionVisibility } from "../motion/use-motion-visibility";
import { assignMotionRef } from "../motion/refs";

export type MotionDrawerVariant = "default" | "floating" | "stack" | "bottom";
export type MotionDrawerPanel = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
};
export type MotionDrawerProps = Omit<
  React.ComponentProps<"div">,
  "title" | "defaultValue"
> & {
  title: string;
  description?: string;
  triggerLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Logical edge, resolved against dir. Bottom trays always dismiss downward. */
  side?: "start" | "end";
  /** Edge navigation, content-sized panel, layered workspace or bottom action tray. */
  variant?: MotionDrawerVariant;
  /** Panel width in pixels, bounded to the viewport. Defaults: 300 / 360 / 540 / 640. */
  width?: number;
  enableDrag?: boolean;
  /** Fraction of the panel to drag toward its edge before dismissing (0.1–0.9). */
  dragThreshold?: number;
  /** The trigger joins the close control, pushes toward the edge, or fades in place. */
  buttonOpeningVariants?: "merge" | "push" | "stay";
  /** Spring tuning; ignored when motion is disabled. */
  animationConfig?: { stiffness?: number; damping?: number; mass?: number };
  /** Mounted, selectable card surfaces for the stack variant. */
  panels?: MotionDrawerPanel[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Seconds between stack-card entrances (0–0.25). */
  stackStagger?: number;
  /** Reusable custom launcher. Its own disabled state is respected. */
  trigger?: React.ReactElement;
  closeLabel?: string;
  onCloseAutoFocus?: React.ComponentProps<
    typeof Dialog.Content
  >["onCloseAutoFocus"];
};

const widths: Record<MotionDrawerVariant, number> = {
  default: 300,
  floating: 360,
  stack: 540,
  bottom: 640,
};
const bounded = (
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
) =>
  value !== undefined && Number.isFinite(value)
    ? Math.max(min, Math.min(max, value))
    : fallback;
const interactive =
  "button, a, input, select, textarea, [contenteditable], [role=button], [role=slider], [data-no-drawer-drag]";

function useStaggeredReveal(count: number, enabled: boolean, stagger: number) {
  const [revealed, setRevealed] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) return;
    const timers = [
      window.setTimeout(() => setRevealed(0), 0),
      ...Array.from({ length: count }, (_, index) =>
        window.setTimeout(
          () => setRevealed((current) => Math.max(current, index + 1)),
          index * stagger * 1000,
        ),
      ),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [count, enabled, stagger]);
  return enabled ? revealed : count;
}

function StackPanels({
  panels,
  value,
  defaultValue,
  onValueChange,
  enabled,
  transition,
  stagger,
  direction,
  physical,
  closeLabel,
}: {
  panels: MotionDrawerPanel[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  enabled: boolean;
  transition: Transition;
  stagger: number;
  direction: "ltr" | "rtl";
  physical: "left" | "right";
  closeLabel: string;
}) {
  const enabledPanels = panels.filter((item) => !item.disabled);
  const fallback = enabledPanels[0]?.value;
  const exists = (candidate: string | undefined) =>
    panels.some((item) => item.value === candidate);
  const enabledChoice = (candidate: string | undefined) =>
    panels.some((item) => item.value === candidate && !item.disabled);
  const [localValue, setLocalValue] = React.useState(() =>
    enabledChoice(defaultValue) ? defaultValue : fallback,
  );
  const activeValue = exists(value)
    ? value
    : exists(localValue)
      ? localValue
      : fallback;
  const activePanel = panels.find((item) => item.value === activeValue);
  const focusValue = activePanel?.disabled ? fallback : activeValue;
  const groupId = React.useId();
  const tabRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const deckRef = React.useRef<HTMLDivElement>(null);
  const [deckSize, setDeckSize] = React.useState({
    width: 0,
    height: 0,
    tabHeight: 48,
  });
  const revealed = useStaggeredReveal(panels.length, enabled, stagger);
  const activeIndex = Math.max(
    0,
    panels.findIndex((item) => item.value === activeValue),
  );
  const edge = physical === "left" ? -1 : 1;

  React.useLayoutEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;
    const measure = () => {
      const { width, height } = deck.getBoundingClientRect();
      const tabHeight = matchMedia("(max-width: 480px)").matches ? 64 : 48;
      setDeckSize((current) =>
        current.width === width &&
        current.height === height &&
        current.tabHeight === tabHeight
          ? current
          : { width, height, tabHeight },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(deck);
    return () => observer.disconnect();
  }, []);

  const select = (next: MotionDrawerPanel) => {
    if (next.disabled || next.value === activeValue) return;
    if (value === undefined) setLocalValue(next.value);
    onValueChange?.(next.value);
  };
  const focusAndSelect = (index: number) => {
    const next = panels[index];
    if (!next || next.disabled) return;
    tabRefs.current[index]?.focus();
    select(next);
  };
  const move = (from: number, step: number) => {
    if (!enabledPanels.length) return;
    for (let distance = 1; distance <= panels.length; distance += 1) {
      const index = (from + step * distance + panels.length) % panels.length;
      if (!panels[index]?.disabled) return focusAndSelect(index);
    }
  };

  return (
    <div className="v-motion-drawer__stack">
      <div
        ref={deckRef}
        className="v-motion-drawer__stack-deck"
        role="tablist"
        aria-orientation="horizontal"
      >
        {panels.map((item, index) => {
          const active = item.value === activeValue;
          const tabId = `${groupId}-tab-${index}`;
          const paneId = `${groupId}-pane-${index}`;
          const depth = active
            ? 0
            : (index - activeIndex + panels.length) % panels.length ||
              panels.length;
          // Keep every handle readable: a full-height rotated card can move its
          // header much farther than its small angle suggests on narrow screens.
          const peekBudget = Math.min(
            24,
            (deckSize.width / panels.length) * 0.06,
          );
          const x = active ? 0 : Math.min(20, depth * 7, peekBudget * 0.4);
          const y = active ? 0 : Math.min(6, depth * 2);
          const scale = active ? 1 : Math.max(0.992, 1 - depth * 0.002);
          const desiredRotation = Math.min(2.4, depth * 0.8);
          const horizontalRoom = Math.max(0, peekBudget - x);
          const verticalRoom = Math.max(0, 30 - y);
          const horizontalRotation = deckSize.height
            ? (Math.asin(
                Math.min(1, horizontalRoom / (scale * deckSize.height)),
              ) *
                180) /
              Math.PI
            : 0;
          const verticalRotation = deckSize.width
            ? (Math.asin(
                Math.min(1, verticalRoom / ((scale * deckSize.width) / 2)),
              ) *
                180) /
              Math.PI
            : 0;
          const rotation = Math.min(
            desiredRotation,
            horizontalRotation,
            verticalRotation,
          );
          const entered = {
            x: -edge * x,
            y,
            rotate: -edge * rotation,
            scale,
            opacity: 1,
          };
          const concealed = {
            ...entered,
            x: edge * (48 + index * 10),
            opacity: 0,
          };
          return (
            <motion.section
              key={item.value}
              data-stack-card=""
              data-active={active ? "true" : "false"}
              role="presentation"
              className="v-motion-drawer__stack-card"
              style={
                {
                  zIndex: active ? panels.length + 1 : panels.length - depth,
                  "--stack-tab-index": index,
                  "--stack-tab-count": panels.length,
                } as React.CSSProperties
              }
              initial={enabled ? concealed : false}
              animate={revealed > index ? entered : concealed}
              exit={enabled ? { opacity: 0 } : undefined}
              transition={enabled ? transition : { duration: 0 }}
            >
              <svg
                className="v-motion-drawer__stack-outline"
                viewBox={`0 0 ${deckSize.width || 540} ${deckSize.height || 720}`}
                preserveAspectRatio="none"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d={stackOutline(
                    deckSize.width || 540,
                    deckSize.height || 720,
                    direction === "rtl" ? panels.length - 1 - index : index,
                    panels.length,
                    deckSize.tabHeight,
                  )}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <button
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={tabId}
                type="button"
                role="tab"
                className="v-motion-drawer__stack-tab"
                aria-selected={active}
                aria-controls={paneId}
                tabIndex={item.value === focusValue && !item.disabled ? 0 : -1}
                disabled={item.disabled}
                onClick={() => select(item)}
                onKeyDown={(event) => {
                  const rtlStep = direction === "rtl" ? -1 : 1;
                  const step =
                    event.key === "ArrowDown"
                      ? 1
                      : event.key === "ArrowUp"
                        ? -1
                        : event.key === "ArrowRight"
                          ? rtlStep
                          : event.key === "ArrowLeft"
                            ? -rtlStep
                            : 0;
                  if (step) {
                    event.preventDefault();
                    move(index, step);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    focusAndSelect(
                      panels.findIndex((panel) => !panel.disabled),
                    );
                  } else if (event.key === "End") {
                    event.preventDefault();
                    for (
                      let cursor = panels.length - 1;
                      cursor >= 0;
                      cursor -= 1
                    )
                      if (!panels[cursor]?.disabled) {
                        focusAndSelect(cursor);
                        break;
                      }
                  }
                }}
              >
                <span>{item.label}</span>
              </button>
              <div className="v-motion-drawer__stack-card-surface">
                {active && (
                  <div className="v-motion-drawer__stack-card-header">
                    <h2 className="v-motion-drawer__stack-card-title">
                      {item.icon && (
                        <span
                          className="v-motion-drawer__stack-icon"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      )}
                      <span>{item.label}</span>
                    </h2>
                    <Dialog.Close asChild>
                      <Button
                        variant="ghost"
                        className="v-motion-drawer__close"
                        aria-label={closeLabel}
                      >
                        <X size={16} aria-hidden="true" />
                      </Button>
                    </Dialog.Close>
                  </div>
                )}
                <ScrollArea
                  id={paneId}
                  role="tabpanel"
                  aria-labelledby={tabId}
                  aria-hidden={!active}
                  inert={!active}
                  hidden={!active}
                  variant="plain"
                  className="v-motion-drawer__stack-pane-scroll"
                  data-lenis-prevent
                  viewportProps={{ "aria-label": `${item.label} content` }}
                >
                  {item.children}
                </ScrollArea>
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}

/** Keep native pan/focus geometry, with one scoped scrollbar beside the body. */
function DrawerBody({ children }: { children: React.ReactNode }) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = React.useState("");
  React.useEffect(() => {
    const node = content.current;
    if (!node) return;
    const observer = new ResizeObserver(() =>
      setContentSize(`${node.scrollWidth}:${node.scrollHeight}`),
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="v-motion-drawer__body-region">
      <div
        ref={setElement}
        className="v-motion-drawer__body"
        data-lenis-prevent
      >
        <div ref={content}>{children}</div>
      </div>
      <ElementScrollBar
        scrollElement={element}
        refreshKey={contentSize}
        aria-label="Drawer scroll position"
        data-no-drawer-drag
      />
    </div>
  );
}

function DrawerPanel({
  title,
  description,
  children,
  variant,
  physical,
  direction,
  width,
  enableDrag,
  threshold,
  enabled,
  transition,
  dismiss,
  stackPanels,
  stackStagger,
  closeLabel,
  onCloseAutoFocus,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  variant: MotionDrawerVariant;
  physical: "left" | "right";
  direction: "ltr" | "rtl";
  width: number;
  enableDrag: boolean;
  threshold: number;
  enabled: boolean;
  transition: Transition;
  dismiss: () => void;
  stackPanels?: React.ReactNode;
  closeLabel: string;
  stackStagger: number;
  onCloseAutoFocus?: React.ComponentProps<
    typeof Dialog.Content
  >["onCloseAutoFocus"];
}) {
  const panel = React.useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const drag = useDragControls();
  const present = useIsPresent();
  const bottom = variant === "bottom";
  const hasStackPanels = stackPanels !== undefined;
  const revealedSheets = useStaggeredReveal(2, enabled, stackStagger);
  const [extent, setExtent] = React.useState(width);
  const entered = { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 };
  const hidden = bottom
    ? { ...entered, y: "calc(100% + 24px)" }
    : {
        ...entered,
        x:
          variant === "default"
            ? physical === "left"
              ? "-100%"
              : "100%"
            : physical === "left"
              ? "calc(-100% - 48px)"
              : "calc(100% + 48px)",
        ...(variant === "floating" ? { scale: 0.96, opacity: 0 } : {}),
        ...(variant === "stack"
          ? { rotate: physical === "left" ? -2 : 2 }
          : {}),
      };

  React.useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const measure = () =>
      setExtent(bottom ? element.clientHeight : element.clientWidth);
    const observer = new ResizeObserver(measure);
    measure();
    observer.observe(element);
    return () => observer.disconnect();
  }, [bottom]);
  React.useEffect(() => {
    if (!present) return;
    if (!enabled) controls.set({ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 });
    else void controls.start({ x: 0, y: 0, scale: 1, opacity: 1, rotate: 0 });
  }, [controls, enabled, present]);
  React.useEffect(() => () => controls.stop(), [controls]);

  return (
    <Dialog.Content
      forceMount
      asChild
      onOpenAutoFocus={(event) => {
        event.preventDefault();
        requestAnimationFrame(() =>
          panel.current?.focus({ preventScroll: true }),
        );
      }}
      onCloseAutoFocus={onCloseAutoFocus}
    >
      <motion.div
        ref={panel}
        data-slot="motion-drawer-content"
        data-variant={variant}
        data-side={physical}
        data-motion={enabled ? "on" : "off"}
        data-stack-panels={hasStackPanels ? "true" : undefined}
        tabIndex={-1}
        dir={direction}
        className="v-motion-drawer__panel"
        style={{ "--drawer-width": `${width}px` } as React.CSSProperties}
        initial={enabled && !hasStackPanels ? hidden : false}
        animate={controls}
        exit={enabled ? hidden : entered}
        transition={transition}
        drag={enableDrag ? (bottom ? "y" : "x") : false}
        dragControls={drag}
        dragListener={false}
        dragConstraints={
          bottom
            ? { top: 0, bottom: extent }
            : physical === "left"
              ? { left: -extent, right: 0 }
              : { left: 0, right: extent }
        }
        dragElastic={0.1}
        dragMomentum={false}
        onPointerDown={(event) => {
          if (
            !enableDrag ||
            event.button !== 0 ||
            !(event.target instanceof Element) ||
            event.target.closest(interactive)
          )
            return;
          // A vertical tray only drags from its header so its content can scroll.
          if (bottom && !event.target.closest(".v-motion-drawer__top")) return;
          drag.start(event);
        }}
        onDragEnd={(_, info) => {
          const travel = bottom
            ? info.offset.y
            : physical === "left"
              ? -info.offset.x
              : info.offset.x;
          if (travel > extent * threshold) dismiss();
          // Also settle if a controlled caller declines the close request.
          void controls.start({ x: 0, y: 0, transition });
        }}
        onPointerCancel={() => {
          void controls.start({ x: 0, y: 0, transition });
        }}
      >
        {variant === "stack" &&
          !hasStackPanels &&
          [0, 1].map((index) => (
            <motion.div
              key={index}
              aria-hidden="true"
              className="v-motion-drawer__stack-sheet"
              data-sheet={index + 1}
              initial={
                enabled
                  ? {
                      x:
                        physical === "left"
                          ? -32 - index * 12
                          : 32 + index * 12,
                      opacity: 0,
                    }
                  : false
              }
              animate={
                revealedSheets > index
                  ? { x: 0, opacity: 1 }
                  : {
                      x:
                        physical === "left"
                          ? -32 - index * 12
                          : 32 + index * 12,
                      opacity: 0,
                    }
              }
              transition={enabled ? transition : { duration: 0 }}
            />
          ))}
        <div className="v-motion-drawer__surface">
          {hasStackPanels ? (
            <>
              <Dialog.Title className="sr-only">{title}</Dialog.Title>
              <Dialog.Description className="sr-only">
                {description ?? "Choose a card and use its controls."}
              </Dialog.Description>
            </>
          ) : (
            <div className="v-motion-drawer__top">
              {bottom && (
                <span className="v-motion-drawer__grip" aria-hidden="true" />
              )}
              <Dialog.Title className="v-motion-drawer__title">
                {title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  variant="ghost"
                  className="v-motion-drawer__close"
                  aria-label={closeLabel}
                >
                  <X size={16} aria-hidden="true" />
                </Button>
              </Dialog.Close>
              <Dialog.Description
                className={
                  description ? "v-motion-drawer__description" : "sr-only"
                }
              >
                {description ??
                  "Use the controls in this panel, or close it to return to the page."}
              </Dialog.Description>
            </div>
          )}
          {hasStackPanels ? (
            <div className="v-motion-drawer__body" data-lenis-prevent>
              {stackPanels}
            </div>
          ) : (
            <DrawerBody>{children}</DrawerBody>
          )}
        </div>
      </motion.div>
    </Dialog.Content>
  );
}

/** Reference geometry and drag interaction, with Radix focus, scroll and dismissal semantics. */
export function MotionDrawer({
  title,
  description,
  triggerLabel = "Open navigation",
  open,
  defaultOpen = false,
  onOpenChange,
  side = "start",
  variant = "default",
  width,
  enableDrag = true,
  dragThreshold = 0.3,
  buttonOpeningVariants = "merge",
  animationConfig,
  panels,
  value,
  defaultValue,
  onValueChange,
  stackStagger = 0.09,
  trigger: customTrigger,
  closeLabel = "Close navigation",
  onCloseAutoFocus,
  children,
  className,
  ref,
  ...props
}: MotionDrawerProps) {
  const [localOpen, setLocalOpen] = React.useState(defaultOpen);
  const [toggleOffset, setToggleOffset] = React.useState({ x: 0, y: 0 });
  const host = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const launcher = React.useRef<HTMLSpanElement>(null);
  const { enabled } = useMotionVisibility(host);
  const direction = useDirection(
    props.dir === "rtl" || props.dir === "ltr" ? props.dir : undefined,
  );
  const physical =
    (side === "start") !== (direction === "rtl") ? "left" : "right";
  const isOpen = open ?? localOpen;
  const panelWidth = bounded(width, widths[variant], 200, 960);
  const threshold = bounded(dragThreshold, 0.3, 0.1, 0.9);
  const stagger = bounded(stackStagger, 0.09, 0, 0.25);
  const transition: Transition = enabled
    ? {
        type: "spring",
        stiffness: bounded(animationConfig?.stiffness, 180, 40, 600),
        damping: bounded(animationConfig?.damping, 26, 15, 60),
        mass: bounded(animationConfig?.mass, 1, 0.5, 2),
      }
    : { duration: 0 };
  React.useLayoutEffect(() => {
    if (isOpen && launcher.current) {
      const rect = launcher.current.getBoundingClientRect();
      const transform = new DOMMatrixReadOnly(
        getComputedStyle(launcher.current).transform,
      );
      const inset = variant === "default" ? 0 : variant === "stack" ? 24 : 16;
      const actualWidth = Math.min(
        panelWidth,
        window.innerWidth - Math.max(32, inset * 2),
      );
      const left =
        physical === "left" ? inset : window.innerWidth - inset - actualWidth;
      // Inline launchers need measured travel to meet the reference's close control.
      const x =
        buttonOpeningVariants === "merge"
          ? left + actualWidth - 52 - (rect.x + rect.width / 2 - transform.m41)
          : buttonOpeningVariants === "push"
            ? (physical === "left" ? -1 : 1) * 40
            : 0;
      setToggleOffset({
        x: variant === "bottom" ? 0 : x,
        y:
          buttonOpeningVariants === "merge" && variant !== "bottom"
            ? inset + 30 - (rect.y + rect.height / 2 - transform.m42)
            : 0,
      });
    }
  }, [isOpen, panelWidth, physical, variant, buttonOpeningVariants]);
  const change = (next: boolean) => {
    if (open === undefined) setLocalOpen(next);
    onOpenChange?.(next);
  };
  const hostRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      host.current = node;
      return assignMotionRef(ref, node);
    },
    [ref],
  );
  return (
    <div
      {...props}
      ref={hostRef}
      data-slot="motion-drawer"
      data-variant={variant}
      className={cn("v-motion-drawer", className)}
    >
      <Dialog.Root open={isOpen} onOpenChange={change}>
        <motion.span
          ref={launcher}
          className="v-motion-drawer__launcher"
          animate={
            isOpen
              ? {
                  ...(enabled ? toggleOffset : { x: 0, y: 0 }),
                  opacity: 0,
                  scale: enabled && buttonOpeningVariants === "merge" ? 0.7 : 1,
                }
              : { x: 0, y: 0, opacity: 1, scale: 1 }
          }
          transition={transition}
        >
          <Dialog.Trigger asChild>
            {customTrigger ?? (
              <Button ref={trigger} className="v-motion-drawer__trigger">
                <Menu size={16} aria-hidden="true" />
                {triggerLabel}
              </Button>
            )}
          </Dialog.Trigger>
        </motion.span>
        <AnimatePresence>
          {isOpen && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay forceMount asChild>
                <motion.div
                  data-slot="motion-drawer-overlay"
                  className="v-motion-drawer__overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: enabled ? 0.22 : 0 }}
                />
              </Dialog.Overlay>
              <DrawerPanel
                title={title}
                description={description}
                variant={variant}
                physical={physical}
                direction={direction}
                width={panelWidth}
                enableDrag={enableDrag}
                threshold={threshold}
                enabled={enabled}
                transition={transition}
                dismiss={() => change(false)}
                closeLabel={closeLabel}
                onCloseAutoFocus={onCloseAutoFocus}
                stackStagger={stagger}
                stackPanels={
                  variant === "stack" && panels?.length ? (
                    <StackPanels
                      panels={panels}
                      value={value}
                      defaultValue={defaultValue}
                      onValueChange={onValueChange}
                      enabled={enabled}
                      transition={transition}
                      stagger={stagger}
                      direction={direction}
                      physical={physical}
                      closeLabel={closeLabel}
                    />
                  ) : undefined
                }
              >
                {children}
              </DrawerPanel>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  );
}
