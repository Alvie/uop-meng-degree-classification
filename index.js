function pageLoad() {
	const secondYearPercentages = document.querySelectorAll(
		"input[name=second-year-percentage]"
	);
	const thirdYearPercentages = document.querySelectorAll(
		"input[name=third-year-percentage]"
	);
	const thirdYearProjectPercentage = document.querySelector(
		"input[name=third-year-project-percentage]"
	);
	const mastersYear15Percentages = document.querySelectorAll(
		"input[name=masters-year-15-percentage]"
	);
	const mastersYear30Percentages = document.querySelectorAll(
		"input[name=masters-year-30-percentage]"
	);

	const ruleATextField = document.querySelector(".rule-a-percentage");
	const ruleBTextField = document.querySelector(".rule-b-percentage");
	const classificationTextField = document.querySelector(".classification");

	let marks = {
		mastersYear: [],
		thirdYear: [],
		secondYear: [],
	};

	function toClassification(mark) {
		if (mark < 40) return "Failed";
		if (mark < 60) return "Pass";
		if (mark < 70) return "Merit";
		return "Distinction";
	}

	function getArrayOfMarks(inputElements, numberOfMarks) {
		const isList = NodeList.prototype.isPrototypeOf(inputElements);
		let values = [];

		if (isList) {
			values = Array.from(inputElements, (inputElement) =>
				Array.from({ length: numberOfMarks }, () => {
					return Math.max(
						0,
						Math.min(100, parseInt(inputElement.value))
					);
				})
			).flat();
		} else {
			values = Array.from({ length: numberOfMarks }, () =>
				Math.max(0, Math.min(100, parseInt(inputElements.value)))
			);
		}

		return values;
	}

	const lowToHigh = (a, z) => {
		return a - z;
	};

	// THIS WAS ASSUMING IT WAS 20 CREDITS IN TOTAL,
	// NOT 20 CREDITS FOR EACH YEAR
	// DO NOT UNCOMMENT UNLESS ITS 20 in total
	// function identifyLowest() {
	//     const mastersYearLowest = marks.mastersYear.slice(0, 4);
	//     const thirdYearLowest = marks.thirdYear.slice(0, 4);
	//     const secondYearLowest = marks.secondYear.slice(0, 4);

	//     const combinedList = [
	//         ...mastersYearLowest.map(value => ({ value, year: 'masters' })),
	//         ...thirdYearLowest.map(value => ({ value, year: 'third' })),
	//         ...secondYearLowest.map(value => ({ value, year: 'second' }))
	//     ];

	//     combinedList.sort((a, b) => a.value - b.value);

	//     const lowestFour = combinedList.slice(0, 4);
	//     return lowestFour;
	// }

	function mean(array) {
		return array.reduce((a, b) => a + b) / array.length;
	}

	function calculateRules() {
		// THIS WAS ASSUMING IT WAS 20 CREDITS IN TOTAL,
		// NOT 20 CREDITS FOR EACH YEAR
		// DO NOT UNCOMMENT UNLESS ITS 20 in total
		// lowest = identifyLowest();
		// counts = lowest.reduce((count, item) => {
		//     count[item.year] = (count[item.year] || 0) + 1;
		//     return count;
		// }, {});
		// document.querySelector('pre').textContent = JSON.stringify(lowest);

		// discount 20 credits for each year
		// length for each should be 20 (20x 5 credits = 100 credits)
		const mastersMarks = marks.mastersYear.slice(4);
		const thirdMarks = marks.thirdYear.slice(4);
		const secondMarks = marks.secondYear.slice(4);

		const containsNaN = [
			...mastersMarks,
			...thirdMarks,
			...secondMarks,
		].some(Number.isNaN);

		if (
			containsNaN ||
			mastersMarks.length !== 20 ||
			thirdMarks.length !== 20 ||
			secondMarks.length !== 20
		) {
			return;
		}

		const mastersMean = mean(mastersMarks);
		const thirdMean = mean(thirdMarks);
		const secondMean = mean(secondMarks);

		// Rule A - 50:50 - Masters:Third
		ruleAPercentage = Number(0.5 * mastersMean + 0.5 * thirdMean).toFixed(
			2
		);

		// Rule B - 20:40:40 - Masters:Third
		ruleBPercentage = Number(
			0.4 * mastersMean + 0.4 * thirdMean + 0.2 * secondMean
		).toFixed(2);

		const greatestPercentage = Math.max(ruleAPercentage, ruleBPercentage);
		const classification = toClassification(greatestPercentage);

		ruleATextField.textContent = ruleAPercentage;
		ruleBTextField.textContent = ruleBPercentage;
		classificationTextField.textContent = classification;
	}

	secondYearPercentages.forEach((secondYearPercentageInput) => {
		secondYearPercentageInput.addEventListener("input", () => {
			// 20 credits = 4x 5 credits
			marks.secondYear = getArrayOfMarks(secondYearPercentages, 4).sort(
				lowToHigh
			);
			calculateRules();
		});
	});

	thirdYearPercentages.forEach((thirdYearPercentageInput) => {
		thirdYearPercentageInput.addEventListener("input", () => {
			// 20 credits = 4x 5 credits
			// 40 credits = 8x 5 credits
			marks.thirdYear = getArrayOfMarks(thirdYearPercentages, 4)
				.concat(getArrayOfMarks(thirdYearProjectPercentage, 8))
				.sort(lowToHigh);
			calculateRules();
		});
	});

	thirdYearProjectPercentage.addEventListener("input", () => {
		// 20 credits = 4x 5 credits
		// 40 credits = 8x 5 credits
		marks.thirdYear = getArrayOfMarks(thirdYearPercentages, 4)
			.concat(getArrayOfMarks(thirdYearProjectPercentage, 8))
			.sort(lowToHigh);
		calculateRules();
	});

	mastersYear15Percentages.forEach((mastersYear15PercentageInput) => {
		mastersYear15PercentageInput.addEventListener("input", () => {
			// 15 credits = 3x 5 credits
			// 30 credits = 6x 5 credits
			marks.mastersYear = getArrayOfMarks(mastersYear15Percentages, 3)
				.concat(getArrayOfMarks(mastersYear30Percentages, 6))
				.sort(lowToHigh);
			calculateRules();
		});
	});

	mastersYear30Percentages.forEach((mastersYear30PercentageInput) => {
		mastersYear30PercentageInput.addEventListener("input", () => {
			// 15 credits = 3x 5 credits
			// 30 credits = 6x 5 credits
			marks.mastersYear = getArrayOfMarks(mastersYear15Percentages, 3)
				.concat(getArrayOfMarks(mastersYear30Percentages, 6))
				.sort(lowToHigh);
			calculateRules();
		});
	});
}

window.addEventListener("load", pageLoad);
