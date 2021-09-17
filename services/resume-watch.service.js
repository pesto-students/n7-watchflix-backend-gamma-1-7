var ResumeWatch = require('../models/ResumeWatch');

exports.index = async function () {
	try {
		return await ResumeWatch.find();
	} catch (e) {
		throw Error('Error while paginating resumeWatches');
	}
};

exports.store = async function (dto) {
	try {
		let resumeWatch = await new ResumeWatch(dto);
		return resumeWatch.save();
	} catch (e) {
		// console.log('ss', e);
		throw Error(e);
	}
};
exports.show = async function (id) {
	try {
		let resumeWatch = await ResumeWatch.findById(id);
		return resumeWatch;
	} catch (e) {
		throw Error('Error while find resumeWatch by id');
	}
};

exports.update = async function (id, dto) {
	try {
		let resumeWatch = await ResumeWatch.findByIdAndUpdate(id, dto, { new: true });
		return resumeWatch;
	} catch (e) {
		throw Error(e);
	}
};

exports.destroy = async function (id) {
	try {
		let resumeWatch = await ResumeWatch.findById(id);
		resumeWatch.delete();
		return resumeWatch;
	} catch (e) {
		throw Error('Error while deleting resumeWatch');
	}
};
exports.hardDestroy = async function (id) {
	try {
		let resumeWatch = await ResumeWatch.findByIdAndDelete(id);
		return resumeWatch;
	} catch (e) {
		throw Error('Error while deleting resumeWatch');
	}
};

exports.getDetails = async function (userId, entity, entityId) {
	try {
		let resumeWatch = await ResumeWatch.findOne({ user: userId, entity: entity, entityId: entityId });
		return resumeWatch;
	} catch (e) {
		throw Error('Error while find resumeWatch by id');
	}
};
exports.checkOrUpdate = async function (userId, entity, entityId, runningTime) {
	let rwatch = await ResumeWatch.findOne({ user: userId, entity: entity, entityId: entityId });
	if (rwatch) {
		// update
		return await ResumeWatch.updateOne(
			{ user: userId, entity: entity, entityId: entityId },
			{ watchTime: runningTime }
		);
	} else {
		let r = await new ResumeWatch({
			user: userId,
			entity: entity,
			entityId: entityId,
			watchTime: runningTime,
		});
		return r;
	}

	// try {
	// 	let resumeWatch = await ResumeWatch.findOne({ user: userId, entity: entity, entityId: entityId });
	// 	return resumeWatch;
	// } catch (e) {
	// 	throw Error('Error while find resumeWatch by id');
	// }
};