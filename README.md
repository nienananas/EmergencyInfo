#Emergency Info

##General
This website provides emergency contact information based on countries.

##Location
One feature available is that on loading the website, if granted, the website determines
the current location of the user. Based on this, the emergency contact information of the current country is loaded.

##Search
In addition, users can search for a specific country that they want information on. Then the emergency contact information for that country is retrieved.

##Data Sources
For retrieving the country the user is located in, the website uses the OpenStreetMap [Nominatim](https://nominatim.openstreetmap.org/reverse) API.
The data for the emergency contact information is from the source from [EmergencyNumberAPI](https://emergencynumberapi.com/).