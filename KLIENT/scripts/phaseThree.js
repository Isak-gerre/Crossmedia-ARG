"use strict";

async function renderPhase3() {
	const sessionCode = JSON.parse(getFromLS("user")).session;
	const player = JSON.parse(getFromLS("user"));
	const activeSession = await getSessions("sessionCode", sessionCode);
	if (activeSession.phase == 3) {
		// createChallengeGrid();
	}
}

renderPhase3();
