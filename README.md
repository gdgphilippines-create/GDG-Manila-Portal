-- GDG Web App

This branch contains an example app organization for deploying to GCP. 

--- Frontend 
The frontend is a single-page application (SPA) that renders components based on the 
route specified under the top-level router in App.jsx Each route has a corresponding
component under the `views` folder.

The admin view is responsible for creating requests to the Firestore API. Based on the
clicked button, the corresponding button click callback performs a query to the Firestore
collection.

--- Backend
As of now, the backend has no practical function apart from setting the boilerplate
for the possible Bevy API integration. We have yet to gain access to the Bevy of GDG Manila,
and this requires the assistance of the Registration Team for the creation of test
events.
