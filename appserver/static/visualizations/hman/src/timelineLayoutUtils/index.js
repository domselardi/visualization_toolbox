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

module.exports = {
  resolvePixelValue,
};
