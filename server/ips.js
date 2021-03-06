//IPS aka Intrusion Prevention System

import logger from './logger.js';

let attackers = new Map();//not an object in order to use an ipaddr object as a key

export function banned(ip) {
	for (let [savIp, savObj] of attackers.entries()) {//is using strings faster?
		if (ip.match(savIp, 128) && savObj.banned) return true;//we would need to create a string per call but looping wouldn't be necessary
	}
	return false;
}
export function ban(ip) {
	logger(logger.INFO, 'Received garbage from: ' + ip + '. Temporarily banning IP...');
	function unBan() {
		this.banned = false;
	}
	function unDistrust() {
		attackers.delete(this);
	}

	for (let [savIp, savObj] of attackers.entries()) {
		if (ip.match(savIp, 128)) {
			savObj.attackAmount++;
			clearTimeout(savObj.banId);
			clearTimeout(savObj.distrustId);
			savObj.banId = setTimeout(unBan.bind(savObj), savObj.attackAmount*500);
			savObj.distrustId = setTimeout(unDistrust.bind(savIp), savObj.attackAmount*1000);
			savObj.banned = true;
			return;
		}
	}

	let metadataObj = {
		attackAmount: 1,
		banned: true
	};
	metadataObj.banId = setTimeout(unBan.bind(metadataObj), 500);
	metadataObj.distrustId = setTimeout(unDistrust.bind(ip), 1000);

	attackers.set(ip, metadataObj);
}
