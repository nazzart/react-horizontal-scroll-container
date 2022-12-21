import React, { useCallback, useRef, useState } from "react";
import Container from "@mui/material/Container";
import styled from "@emotion/styled";
import Box from '@mui/material/Box';

const HorizontalContainerOuter = styled.div`
  overflow: hidden;
`;

const HorizontalContentOuter = styled.div`
  -ms-overflow-style: none;
  overflow: scroll;
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const HorizontalContainerInner = styled.div`
  display: flex;
  height: 100%;
  overflow: visible;
  position: relative;
  flex-direction: column;
`;

const HorizontalContentInner = styled.div`
  display: flex;
  -ms-overflow-style: none;
  overflow: visible;
  scrollbar-width: none;
  padding: 15px 3px;

  ::-webkit-scrollbar {
    display: none;
  }

  > div {
    flex: 0 0 auto;
    margin-right: 15px;
    margin-bottom: 0px;

    &:first-of-type {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }

    .MuiPaper-root {
      height: 100%;
    }
  }
`;

const HorizontalScrollbarNav = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;

  &:hover {
    .horizontal-scrollbars-track {
      height: 3px;
    }

    .horizontal-scrollbars-thumb {
      height: 8px;
      top: -3px;
    }
  }
`;

const HorizontalScrollbarNavInner = styled.div`
  display: block;
  width: 100%;
  position: relative;
  height: 4px;
`;

const HorizontalScrollbarTrack = styled.div`
  background-color: rgb(213, 213, 213);
  left: 0;
  position: absolute;
  right: 0;
  height: 1px;
`;

const HorizontalScrollbarThumb = styled.div`
  background-color: #848484;
  position: absolute;
  border-radius: 4px;
  height: 4px;
  top: -2px;
`;

/**
 * Horizontal Scrollbar - gives ability to scroll any content in a horizontal mode
 */
const HorizontalScroll = ({ children, className, ...props }) => {
    /**
     * References to the DOM elements
     */
    const contentRef = useRef(null);
    const scrollTrackRef = useRef(null);
    const scrollThumbRef = useRef(null);

    /**
     * State of observer
     */
    const observer = useState(null);

    /**
     * Contains thumb width
     */
    const [thumbWidth, setThumbWidth] = useState(20);

    /**
     * Contains scroll starting position
     */
    const [scrollStartPosition, setScrollStartPosition] = useState(null);

    /**
     * Contains scroll position from the left side
     */
    const [initialScrollLeft, setInitialScrollLeft] = useState(0);

    /**
     * Indicates if dragging is active
     */
    const [isDragging, setIsDragging] = useState(false);

    /**
     * Resize the thumb/scrollbar when the window size changed
     */
    function handleResize(ref, trackSize) {
        const { clientWidth, scrollWidth } = ref;
        setThumbWidth(Math.max((clientWidth / scrollWidth) * trackSize, 20));
    }

    /**
     * Handles position of the thumb
     */
    const handleThumbPosition = useCallback(() => {
        if (
            !contentRef.current ||
            !scrollTrackRef.current ||
            !scrollThumbRef.current
        ) {
            return;
        }
        const { scrollLeft: contentLeft, scrollWidth: contentWidth } =
                  contentRef.current;
        const { clientWidth: trackWidth } = scrollTrackRef.current;
        let newLeft = (+contentLeft / +contentWidth) * trackWidth;
        newLeft = Math.min(newLeft, trackWidth - thumbWidth);
        const thumb = scrollThumbRef.current;
        thumb.style.left = `${newLeft}px`;
    }, [thumbWidth]);

    /**
     * Handles position of the thumb when moving it with a mouse
     */
    const handleThumbMousemove = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isDragging) {
                const {
                          scrollWidth: contentScrollWidth,
                          offsetWidth: contentOffsetWidth,
                      } = contentRef.current;

                const deltaY =
                          (e.clientX - scrollStartPosition) *
                          (contentOffsetWidth / thumbWidth);
                contentRef.current.scrollLeft = Math.min(
                    initialScrollLeft + deltaY,
                    contentScrollWidth - contentOffsetWidth
                );
            }
        },
        [isDragging, scrollStartPosition, thumbWidth, initialScrollLeft]
    );

    /**
     * Handles position of the thumb when mouse button is pressed
     */
    const handleThumbMousedown = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setScrollStartPosition(e.clientX);
        if (contentRef.current) setInitialScrollLeft(contentRef.current.scrollLeft);
        setIsDragging(true);
    }, []);

    /**
     * Handles position of the thumb when mouse button is un-pressed
     */
    const handleThumbMouseup = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isDragging) {
                setIsDragging(false);
            }
        },
        [isDragging]
    );

    /**
     * If the content and the scrollbar track exist, use a ResizeObserver to adjust height of thumb and listen for scroll event to move the thumb
     */
    React.useEffect(() => {
        if (contentRef.current && scrollTrackRef.current) {
            const ref = contentRef.current;
            const { clientWidth: trackSize } = scrollTrackRef.current;
            observer.current = new ResizeObserver(() => {
                handleResize(ref, trackSize);
            });
            observer.current.observe(ref);
            ref.addEventListener("scroll", handleThumbPosition);
            return () => {
                observer.current.unobserve(ref);
                ref.removeEventListener("scroll", handleThumbPosition);
            };
        }
    }, [observer, handleThumbPosition]);

    const style = props.itemWidth;
    const childrenWithAdjustedProps = React.Children.map(children, child =>
        React.cloneElement(child, style)
    );
    /**
     * Listen for mouse events to handle scrolling by dragging the thumb
     */
    React.useEffect(() => {
        document.addEventListener("mousemove", handleThumbMousemove);
        document.addEventListener("mouseup", handleThumbMouseup);
        document.addEventListener("mouseleave", handleThumbMouseup);
        return () => {
            document.removeEventListener("mousemove", handleThumbMousemove);
            document.removeEventListener("mouseup", handleThumbMouseup);
            document.removeEventListener("mouseleave", handleThumbMouseup);
        };
    }, [handleThumbMousemove, handleThumbMouseup]);
    return (
        <>
            <HorizontalContainerOuter>
                <HorizontalContentOuter onMouseDown={handleThumbMousedown} ref={contentRef} {...props}>
                    <Container
                        sx={{
                            mt: 3,
                            ml: "auto",
                            mr: "auto",
                        }}>
                        <HorizontalContainerInner>
                            <HorizontalContentInner>
                                {childrenWithAdjustedProps}
                                <Box sx={{
                                    minWidth: 3,
                                    display: "block",
                                    paddingRight: "calc(((100vw - 100%) / 2) - 24px)"
                                }}></Box>
                            </HorizontalContentInner>
                        </HorizontalContainerInner>
                    </Container>
                </HorizontalContentOuter>
            </HorizontalContainerOuter>
            <Container>
                <HorizontalScrollbarNav>
                    <HorizontalScrollbarNavInner>
                        <HorizontalScrollbarTrack
                            ref={scrollTrackRef}
                            className="horizontal-scrollbars-track"
                        />
                        <HorizontalScrollbarThumb
                            ref={scrollThumbRef}
                            onMouseDown={handleThumbMousedown}
                            className="horizontal-scrollbars-thumb"
                            style={{
                                width: `${thumbWidth}px`,
                                cursor: isDragging ? "grabbing" : "grab",
                            }}
                        />
                    </HorizontalScrollbarNavInner>
                </HorizontalScrollbarNav>
            </Container>
        </>
    );
};

export default HorizontalScroll;
