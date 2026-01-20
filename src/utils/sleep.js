/**
 * Sleep Utilities
 * Provides sleep and delay functions
 */

export class Sleep {
  /**
   * Simple sleep function
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  static sleep(ms) {
    const duration = Number.isFinite(ms) ? Math.max(0, ms) : 0;
    return new Promise(resolve => {
      const timeout = setTimeout(resolve, duration);
      if (typeof timeout?.unref === 'function') {
        timeout.unref();
      }
    });
  }

  /**
   * Robust sleep that works in background contexts
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>}
   */
  static async robustSleep(ms) {
    if (!Number.isFinite(ms) || ms <= 0) {
      return;
    }
    const startTime = Date.now();
    const endTime = startTime + ms;

    while (Date.now() < endTime) {
      await new Promise(resolve =>
        setTimeout(resolve, Math.min(100, endTime - Date.now()))
      );
    }
  }

  /**
   * Sleep with progress callback
   * @param {number} ms - Milliseconds to sleep
   * @param {Function} callback - Progress callback that receives remaining time
   * @returns {Promise<void>}
   */
  static async sleepWithProgress(ms, callback) {
    if (!Number.isFinite(ms) || ms <= 0) {
      return;
    }
    const startTime = Date.now();
    const endTime = startTime + ms;
    const interval = 50; // Update interval in ms

    while (Date.now() < endTime) {
      const remaining = Math.max(0, endTime - Date.now());

      if (callback) {
        try {
          callback(remaining);
        } catch (error) {
          // Silently ignore callback errors
        }
      }

      await new Promise(resolve =>
        setTimeout(resolve, Math.min(interval, remaining))
      );
    }
  }
}
