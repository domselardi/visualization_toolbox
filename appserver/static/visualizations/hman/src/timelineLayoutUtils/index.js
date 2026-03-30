function parsePixelValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (/^\d+(\.\d+)?px$/.test(trimmedValue) || /^\d+(\.\d+)?$/.test(trimmedValue)) {
      return Number.parseFloat(trimmedValue);
    }
  }

  return 0;
}

function resolvePixelValue(value, fallbackValue) {
  const parsedValue = parsePixelValue(value);
  return parsedValue > 0 ? parsedValue : fallbackValue;
}

function getExplicitElementHeight(element) {
  if (!element || typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    return 0;
  }

  const computedStyle = window.getComputedStyle(element);
  const inlineHeight = parsePixelValue(element.style && element.style.height);
  if (inlineHeight > 0) {
    return inlineHeight;
  }

  const computedHeight = parsePixelValue(computedStyle.height);
  if (computedHeight > 0 && computedStyle.height !== 'auto') {
    return computedHeight;
  }

  const maxHeight = parsePixelValue(computedStyle.maxHeight);
  if (maxHeight > 0) {
    return maxHeight;
  }

  return 0;
}

function getMeasuredViewportHeight(element, contentHeight) {
  if (!element || element.clientHeight <= 0) {
    return 0;
  }

  if (!contentHeight) {
    return element.clientHeight;
  }

  if (Math.abs(element.clientHeight - contentHeight) > 1) {
    return element.clientHeight;
  }

  return 0;
}

function resolveTimelineViewportHeight(chartHolder, contentHeight, fallbackViewportHeight) {
  const scrollWrapper = chartHolder.closest('.hman-scroll-wrapper');
  if (!scrollWrapper) {
    return fallbackViewportHeight || contentHeight || 0;
  }

  const preferredContainers = [
    chartHolder.closest('.shared-reportvisualizer'),
    chartHolder.closest('.dashboard-element'),
    chartHolder.closest('.dashboard-panel'),
    chartHolder.closest('.panel-body'),
  ];

  for (const container of preferredContainers) {
    const explicitHeight = getExplicitElementHeight(container);
    if (explicitHeight > 0) {
      return explicitHeight;
    }

    const measuredHeight = getMeasuredViewportHeight(container, contentHeight);
    if (measuredHeight > 0) {
      return measuredHeight;
    }
  }

  const wrapperParent = scrollWrapper.parentElement;
  const parentExplicitHeight = getExplicitElementHeight(wrapperParent);
  if (parentExplicitHeight > 0) {
    return parentExplicitHeight;
  }

  const parentMeasuredHeight = getMeasuredViewportHeight(wrapperParent, contentHeight);
  if (parentMeasuredHeight > 0) {
    return parentMeasuredHeight;
  }

  const persistedViewportHeight = parsePixelValue(scrollWrapper.dataset.hmanViewportHeight);
  if (persistedViewportHeight > 0) {
    return persistedViewportHeight;
  }

  if (fallbackViewportHeight > 0) {
    return fallbackViewportHeight;
  }

  return contentHeight || 0;
}

function syncTimelineScrollWrapper(chartHolder, contentHeight, fallbackViewportHeight) {
  const scrollWrapper = chartHolder.closest('.hman-scroll-wrapper');
  if (!scrollWrapper) {
    return 0;
  }

  const availableHeight = resolveTimelineViewportHeight(chartHolder, contentHeight, fallbackViewportHeight);

  if (availableHeight > 0) {
    scrollWrapper.style.height = `${availableHeight}px`;
    scrollWrapper.style.maxHeight = `${availableHeight}px`;
    scrollWrapper.dataset.hmanViewportHeight = `${availableHeight}`;
  } else if (contentHeight) {
    scrollWrapper.style.height = `${contentHeight}px`;
    scrollWrapper.style.maxHeight = `${contentHeight}px`;
  } else {
    scrollWrapper.style.height = '';
    scrollWrapper.style.maxHeight = '';
  }

  scrollWrapper.style.overflowY = 'auto';
  scrollWrapper.style.overflowX = 'hidden';
  scrollWrapper.style.minHeight = '0';
  return availableHeight;
}

function scheduleTimelineScrollWrapperSync(chartHolder, contentHeight, fallbackViewportHeight) {
  const syncedHeight = syncTimelineScrollWrapper(chartHolder, contentHeight, fallbackViewportHeight);
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      syncTimelineScrollWrapper(chartHolder, contentHeight, syncedHeight || fallbackViewportHeight);
    });
  }
  return syncedHeight;
}

module.exports = {
  getExplicitElementHeight,
  getMeasuredViewportHeight,
  parsePixelValue,
  resolvePixelValue,
  resolveTimelineViewportHeight,
  scheduleTimelineScrollWrapperSync,
  syncTimelineScrollWrapper,
};
