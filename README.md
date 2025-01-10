# Emergency Info

## General
This website provides emergency contact information based on countries.

## Location
One feature available is that on loading the website, if granted, the website determines
the current location of the user. Based on this, the emergency contact information of the current country is loaded.

## Search
In addition, users can search for a specific country that they want information on. Then the emergency contact information for that country is retrieved.

## Data Sources
For retrieving the country the user is located in, the website uses the OpenStreetMap [Nominatim](https://nominatim.openstreetmap.org/reverse) API. 

The data for the emergency contact information is from the source of the [EmergencyNumberAPI](https://emergencynumberapi.com/) and was updated a bit with the data from [Wikipedia](https://en.wikipedia.org/wiki/List_of_emergency_telephone_numbers).

## Call links
The phone numbers displayed on the website are clickable for faster access in case of an emergency.
When clicked, the user is prompted to confirm his wish to actually call the number.
Then he will be transferred to the app that handles "tel:..." links.

## GitHub Pages
The site is currently running on [GitHub Pages](https://nienananas.github.io/EmergencyInfo/) (as of 07.01.2025).
