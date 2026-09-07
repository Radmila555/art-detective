export interface Rectangle {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface RelativePoint {
  readonly x: number;
  readonly y: number;
}

export function containedImageBounds(
  container: Pick<Rectangle, 'width' | 'height'>,
  imageWidth: number,
  imageHeight: number,
): Rectangle {
  if (container.width <= 0 || container.height <= 0 || imageWidth <= 0 || imageHeight <= 0) {
    throw new RangeError('Размеры контейнера и изображения должны быть положительными');
  }

  const imageRatio = imageWidth / imageHeight;
  const containerRatio = container.width / container.height;

  if (imageRatio > containerRatio) {
    const height = container.width / imageRatio;
    return { left: 0, top: (container.height - height) / 2, width: container.width, height };
  }

  const width = container.height * imageRatio;
  return { left: (container.width - width) / 2, top: 0, width, height: container.height };
}

export function pointerToImagePoint(
  clientX: number,
  clientY: number,
  container: Rectangle,
  imageWidth: number,
  imageHeight: number,
): RelativePoint | null {
  const bounds = containedImageBounds(container, imageWidth, imageHeight);
  const localX = clientX - container.left;
  const localY = clientY - container.top;

  if (
    localX < bounds.left ||
    localX > bounds.left + bounds.width ||
    localY < bounds.top ||
    localY > bounds.top + bounds.height
  ) {
    return null;
  }

  return {
    x: (localX - bounds.left) / bounds.width,
    // Browser coordinates run downwards; Kivy's stored coordinates run upwards.
    y: 1 - (localY - bounds.top) / bounds.height,
  };
}

export function isInsideHitRadius(
  point: RelativePoint,
  correct: RelativePoint,
  radius = 0.05,
): boolean {
  return Math.hypot(point.x - correct.x, point.y - correct.y) <= radius;
}
