function createTripPlan(destination, people, days, budget, preferences, places) {

    people = Number(people);
    days = Number(days);
    budget = Number(budget);

    if (!destination || !people || !days || !budget) {
        throw new Error("Destination, people, days and budget are required");
    }

    if (people <= 0 || days <= 0 || budget <= 0) {
        throw new Error("People, days and budget must be greater than 0");
    }

    if (!Array.isArray(places) || places.length === 0) {
        throw new Error("No tourist places found for this destination");
    }

    let selectedPlaces = places;

    // Filter according to preferences
    if (preferences && preferences.length > 0) {

        let preferred = preferences.toLowerCase();

        let filteredPlaces = places.filter(function(place) {

            let category =
                place.category
                    ? place.category.toLowerCase()
                    : "";

            let name =
                place.name
                    ? place.name.toLowerCase()
                    : "";

            return category.includes(preferred) ||
                   name.includes(preferred);

        });

        if (filteredPlaces.length > 0) {
            selectedPlaces = filteredPlaces;
        }
    }

    // Maximum number of places to visit
    let maxPlaces = days * 3;

    selectedPlaces = selectedPlaces.slice(0, maxPlaces);

    let itinerary = [];

    let placeIndex = 0;

    for (let day = 1; day <= days; day++) {

        let dayPlaces = [];

        for (let i = 0; i < 3; i++) {

            if (placeIndex >= selectedPlaces.length) {
                break;
            }

            dayPlaces.push(selectedPlaces[placeIndex]);

            placeIndex++;
        }

        let dailyCost =
            Math.round((budget / days) * 0.75);

        itinerary.push({
            day: day,
            places: dayPlaces,
            estimatedCost: dailyCost
        });
    }

    let totalEstimatedCost = 0;

    for (let i = 0; i < itinerary.length; i++) {

        totalEstimatedCost +=
            itinerary[i].estimatedCost;
    }

    return {
        destination: destination,
        people: people,
        days: days,
        budget: budget,
        preferences: preferences || "All",
        totalEstimatedCost: totalEstimatedCost,
        remainingBudget: budget - totalEstimatedCost,
        itinerary: itinerary
    };
}


module.exports = {
    createTripPlan
};