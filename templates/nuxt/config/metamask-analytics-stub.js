/** No-op stub for @metamask/sdk-analytics — avoids telemetry fetch errors in local dev. */
export const analytics = {
  enable() {},
  setGlobalProperty() {},
  track() {},
}

export default { analytics }
