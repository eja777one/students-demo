import * as models from './models';

export const ReqBodyHasErrors = (body: any): models.APIErrorResult | boolean => {
	const errors: any = []; // NO TYPE !!!
	// let errorsMessages: Array<models.FieldError>;

	if (!body.title || body.title.length > 40) {
		errors.push({ message: 'incorrect title', field: 'title' });
	};

	if (!body.author || body.author.length > 20) {
		errors.push({ message: 'incorrect author', field: 'author' });
	};

	if (body.availableResolutions) {
		const resolutionArray = Array.from(new Set(body.availableResolutions));
		if (resolutionArray.length !== body.availableResolutions.length) {
			errors.push({
				message: 'incorrect availableResolutions',
				field: 'availableResolutions'
			});
		} else {
			for (let res of body.availableResolutions) {
				if (!(res in models.videoResolution)) {
					errors.push({
						message: 'incorrect availableResolutions',
						field: 'availableResolutions'
					});
					break
				}
			}
		}
	};

	if (body.canBeDownloaded) {
		if (typeof body.canBeDownloaded !== "boolean") {
			errors.push({
				message: 'incorrect canBeDownloaded',
				field: 'canBeDownloaded'
			});
		};
	}

	if (body.minAgeRestriction) {
		const age = body.minAgeRestriction;
		if (!(age >= 1 && age <= 18 || age === null)) {
			errors.push({
				message: 'incorrect minAgeRestriction',
				field: 'minAgeRestriction'
			});
		}
	};

	if (body.publicationDate) {
		if (new Date(body.publicationDate).toISOString() !== body.publicationDate) {
			errors.push({
				message: 'incorrect publicationDate',
				field: 'publicationDate'
			});
		};
	};

	if (errors.length > 0) {
		return { errorsMessages: errors }
	} else return false;
};

export const videoIsExist = (db: any, id: string): any => {
	const video = db.filter((el: any) => el.id === +id)[0];
	return video ? video : false;
}