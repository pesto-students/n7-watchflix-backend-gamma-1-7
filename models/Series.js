/* GET home page. */
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoose_delete = require('mongoose-delete');
const randomstring = require('randomstring');
const slugify = require('slugify');

const schema = mongoose.Schema(
	{
		title: { type: String, required: true },
		slug: String,
		genres: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Genre',
				required: true,
			},
		],
		noOfEpisodes: { type: Number, required: true },
		images: { type: Array, required: true },
		imagesVertical: { type: Array, required: true },
		videoTrailer: { type: Object, required: true },
		yearOfRelease: { type: String, required: true },
		dateOfRelease: { type: String, required: true },
		director: String,
		productionHouse: String,
		imdbRating: Number,
		actors: String,
		plot: String,
		rated: { type: String, required: true },
		isPublished: { type: Boolean, default: true, required: true },
		subscriptionRequired: { type: Boolean, default: false, required: true },
	},
	{
		timestamps: true,
	}
);

schema.plugin(mongoosePaginate);
schema.plugin(mongoose_delete);
schema.pre('save', function (next) {
	let series = this;
	series.slug = slugify(series.title + '-' + series.yearOfRelease + '-' + randomstring.generate(4), {
		lower: true,
	});
	next();
});

module.exports = mongoose.model('Series', schema);
