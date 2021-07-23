import React from "react";
import { secondsToDuration } from "../utils/duration";
import { minutesToDuration } from "../utils/duration";

function TimerCountdown({ session, breakDuration, focusDuration }) {
    
    return session && (
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration                   DONE */}
            <h2 data-testid="session-title">
              {session?.label} for {session?.label === "Focusing"
                ? minutesToDuration(focusDuration)
                : minutesToDuration(breakDuration)} minutes
            </h2>
            {/* TODO: Update message below correctly format the time remaining in the current session                  DONE */}
            <p className="lead" data-testid="session-sub-title">
              {secondsToDuration(session?.timeRemaining)} remaining
            </p>
          </div>
        </div>
    )
}

export default TimerCountdown