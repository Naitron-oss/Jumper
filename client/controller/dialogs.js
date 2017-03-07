import * as view from '../view/index.js';
import * as model from '../model/dialogs.js';
import * as socket from './socket.js';
import * as platform from '../model/platform.js';

view.dialogs.bindSettingsButtons(() => {
	model.setIsModalOpen(true);
	view.dialogs.openSettingsBox();
});

view.dialogs.bindCloseSettingsButton(() => {
	model.setIsModalOpen(false);
	view.dialogs.closeSettingsBox();
});


view.dialogs.bindInfoButton(() => {
	model.setIsModalOpen(true);
	view.dialogs.openInfoBox();
});
view.dialogs.bindCloseInfoButton(() => {
	model.setIsModalOpen(false);
	view.dialogs.closeInfoBox();
});


view.dialogs.bindLeaveButtons(() => {
	if (socket.currentConnection !== undefined && socket.currentConnection.alive()) socket.currentConnection.close();
	socket.currentConnection.close();
});


view.dialogs.bindCloseUntestedBox(() => {
	model.setIsModalOpen(false);
	view.dialogs.closeUntestedBox();
});

view.dialogs.bindCloseUnsupportedBox(() => {
	model.setIsModalOpen(false);
	view.dialogs.closeUnsupportedBox();
});

if (platform.isUnsupported) { // neither Chrome nor Firefox
	model.setIsModalOpen(true);
	view.dialogs.openUnsupportedBox();
} else if (platform.isMobile) { // Chrome or Firefox mobile
	model.setIsModalOpen(true);
	view.dialogs.openUntestedBox();
}

view.dialogs.bindCloseBlockedPortBox(() => {
	model.setIsModalOpen(false);
	view.dialogs.closeBlockedPortBox();
});
