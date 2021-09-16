/* GET home page. */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const randomstring = require('randomstring');
const slugify = require('slugify');

const schema = mongoose.Schema(
	{
		series: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Series',
			required: true,
		},
		episodeNo: {
			type: Number,
			required: true,
		},
		title: { type: String, required: true },
		slug: String,
		images: { type: Array, required: true },
		videoTrailer: { type: String, required: true },
		videoMain: { type: String, required: true },
		dateOfRealease: { type: String, required: true },
		runnningTime: { type: String, required: true },
		plot: String,
		isPublished: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

schema.plugin(mongoosePaginate);
schema.plugin(mongoose_delete);
schema.pre('save', function (next) {
	let seriesEpisode = this;
	seriesEpisode.slug =
		slugify(seriesEpisode.title) + '-' + seriesEpisode.yearOfRelease + '-' + randomstring.generate(10);
	next();
});

module.exports = mongoose.model('SeriesEpisode', schema);
