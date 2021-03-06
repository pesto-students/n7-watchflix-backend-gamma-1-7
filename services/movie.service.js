var Movie = require('../models/Movie');
var GenreService = require('../services/genre.service');

exports.index = async function (req) {
	let search = req.query.search;
	let limit = req.query.limit;
	let page = req.query.page;
	if (search) {
		var regexString = '.*' + search + '.*';
	} else {
		var regexString = '';
	}

	let query = {
		deleted: false,
		isPublished: true,
		$or: [
			{ title: { $regex: new RegExp(regexString, 'i') } },
			{ director: { $regex: new RegExp(regexString, 'i') } },
			{ actors: { $regex: new RegExp(regexString, 'i') } },
		],
	};

	let options = {
		populate: [{ path: 'genres', select: 'title slug' }],
		limit: parseInt(limit) || 10,
		page: page || 1,
		sort: { imdbRating: -1, views: -1 },
	};

	try {
		return await Movie.paginate(query, options);
	} catch (e) {
		throw Error('Error while paginating movies');
	}
};

exports.store = async function (dto) {
	try {
		let movie = await new Movie(dto);
		return movie.save();
	} catch (e) {
		throw Error(e);
	}
};
exports.show = async function (id) {
	try {
		let movie = await Movie.findById(id).populate('genres');
		return movie;
	} catch (e) {
		throw Error('Error while find movie by id');
	}
};

exports.update = async function (id, dto) {
	try {
		let movie = await Movie.findByIdAndUpdate(id, dto, { new: true });
		return movie;
	} catch (e) {
		throw Error(e);
	}
};

exports.destroy = async function (id) {
	try {
		let movie = await Movie.findById(id);
		movie.delete();
		return movie;
	} catch (e) {
		throw Error('Error while deleting movie');
	}
};
exports.hardDestroy = async function (id) {
	try {
		let movie = await Movie.findByIdAndDelete(id);
		return movie;
	} catch (e) {
		throw Error('Error while deleting movie');
	}
};

exports.indexAll = async function (req) {
	let search = req.query.search;
	let limit = req.query.limit;
	let page = req.query.page;
	if (search) {
		var regexString = '.*' + search + '.*';
	} else {
		var regexString = '';
	}

	let query = {
		deleted: false,
		$or: [
			{ title: { $regex: new RegExp(regexString, 'i') } },
			{ director: { $regex: new RegExp(regexString, 'i') } },
			{ actors: { $regex: new RegExp(regexString, 'i') } },
		],
	};

	let options = {
		populate: [{ path: 'genres', select: 'title slug' }],
		limit: parseInt(limit) || 10,
		page: page || 1,
		sort: { createdAt: -1 },
	};

	try {
		return await Movie.paginate(query, options);
	} catch (e) {
		throw Error('Error while paginating movies');
	}
};
exports.popular = async function (req) {
	let limit = req.query.limit;
	let page = req.query.page;
	let query = {
		deleted: false,
		isPublished: true,
	};
	let options = {
		populate: [{ path: 'genres', select: 'title slug' }],
		limit: parseInt(limit) || 10,
		page: page || 1,
		sort: { views: -1, imdbRating: -1 },
	};

	try {
		return await Movie.paginate(query, options);
	} catch (e) {
		throw Error('Error while paginating movies');
	}
};
exports.recommended = async function (req) {
	let search = req.query.search;
	let limit = req.query.limit;
	let page = req.query.page;
	let genreSlug = req.query.genre;
	// console.log(genreSlug);
	if (search) {
		var regexString = '.*' + search + '.*';
	} else {
		var regexString = '';
	}

	let query = {
		deleted: false,
		isPublished: true,
		$or: [
			{ title: { $regex: new RegExp(regexString, 'i') } },
			{ director: { $regex: new RegExp(regexString, 'i') } },
			{ actors: { $regex: new RegExp(regexString, 'i') } },
		],
	};

	if (genreSlug) {
		let genre = await GenreService.findBySlug(genreSlug);
		if (genre) {
			query['$or']['genre'] = genre.id;
		}
	}
	let options = {
		populate: [{ path: 'genres', select: 'title slug' }],
		limit: parseInt(limit) || 10,
		page: page || 1,
		sort: { createdAt: -1 },
	};

	try {
		return await Movie.paginate(query, options);
	} catch (e) {
		throw Error('Error while paginating movies');
	}
};

exports.byGenre = async function (genreSlug) {
	try {
		let genre = await GenreService.findBySlug(genreSlug);
		if (genre) {
			let options = {
				populate: [{ path: 'genres', select: 'title slug' }],
			};

			let movies = await Movie.paginate({ genres: genre._id }, options);
			return movies;
		} else {
			throw Error('Error while find movie by id');
		}
	} catch (e) {
		throw Error('Error while find genre by title');
	}
};

exports.latest = async function (req) {
	let search = req.query.search;
	let limit = req.query.limit;
	let page = req.query.page;
	if (search) {
		var regexString = '.*' + search + '.*';
	} else {
		var regexString = '';
	}

	let query = {
		deleted: false,
		isPublished: true,
		$or: [
			{ title: { $regex: new RegExp(regexString, 'i') } },
			{ director: { $regex: new RegExp(regexString, 'i') } },
			{ actors: { $regex: new RegExp(regexString, 'i') } },
		],
	};

	let options = {
		populate: [{ path: 'genres', select: 'title slug' }],
		limit: parseInt(limit) || 10,
		page: page || 1,
		sort: { createdAt: -1 },
	};

	try {
		return await Movie.paginate(query, options);
	} catch (e) {
		throw Error('Error while paginating movies');
	}
};

exports.bySlug = async function (slug) {
	try {
		let movie = await Movie.findOne({ slug: slug }).populate({ path: 'genres', select: 'title slug' });
		return movie;
	} catch (e) {
		throw Error('Error while find movie by id');
	}
};

exports.findMany = async function (ids) {
	try {
		let movies = await Movie.find({ _id: { $in: ids } }).populate({
			path: 'genres',
			select: 'title slug',
		});
		return movies;
	} catch (e) {
		throw Error('Error while find movie by id');
	}
};
exports.finded = async function (id) {
	try {
		let movies = await Movie.findOne({ _id: id }).populate({
			path: 'genres',
			select: 'title slug',
		});
		return movies;
	} catch (e) {
		// throw Error('Error while find movie by id');
		return '';
	}
};

exports.views = async function (movieId) {
	let m = await Movie.findById(movieId);
	console.log(m.views);
	if (m) {
		console.log('dada');
		let gg = await Movie.findByIdAndUpdate(
			movieId,
			{
				views: parseInt(m.views) + 1,
			},
			{ new: true }
		);
		// console.log({ gg });
		return gg;
	} else {
		return m.views;
	}
};
