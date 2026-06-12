# Stoneham Zoning Map

Interactive map comparing Stoneham, MA's current zoning with the proposed 2026 changes.

The town of Stoneham will be voting on changes to our existing zoning maps and bylaws. To assist the community with understanding the map changes, I built a tool that allows you to compare the current and proposed maps more easily.

## Why we need this

The zoning board did thorough, difficult work putting these proposals together thus far. During our town meeting, however, I realized that residents were struggling to easily compare the two maps:

- They were provided in two .pdf files on different web pages. We needed to download and open side by side for manual comparison.
- Common zones between the current and proposed maps used different colors. For example, the Central Business District is teal in the current map, and bright yellow in the proposed map. This made it nearly impossible to compare the two.
- The parcel map is difficult to read, and while streets are listed, finding your exact address could prove imprecise. Residents were concerned that they couldn't easily see whether their immediate neighborhoods or addresses would be affected, and ultimately as a town we stalled the vote.

## How to use it

- By default, the map opens to a comparison view, but you can toggle at the top to switch to the current & proposed maps, as well.
- Proposed changes are outlined in red.
- You can click any colored shape on the map to see zone details. When in comparison view, it will show both the current and proposed zones.
- In the left panel, select or deselect legend items to control whether they appear on the map, or get factored into comparison.
- By default, I deselected the "overlay" zones from the current map and comparison views, as I found the underlying zones were more important. You are welcome to choose whichever layers you wish to show.
- If you can't find your address on the map, search for your street address in the top right. Beneath the search you'll see the current and proposed zones for that address, and the map will shift and drop a pin at that address.
- You may collapse the left navigation to create more space to explore the map.
- There's no mobile version yet.

## Data sources

- Zoning shapefiles were graciously provided by the Town of Stoneham for both current and proposed zoning.
- I also used the published .pdf maps as a reference for quality analysis:
  - Existing zoning map https://www.stoneham-ma.gov/DocumentCenter/View/2045/Official--Zoning-Map-accepted-May-1-2023?bidId=
  - Proposed new zoning map https://www.stoneham-ma.gov/DocumentCenter/View/11693/Proposed-Zoning-Map-Draft-1-22-26


## About

Built by Stoneham resident Sarah Idriss. Not an official Town of Stoneham resource.

If you are a Stoneham resident looking for more information about bylaw changes, not covered by this tool, please see this draft of bylaw updates: https://www.stoneham-ma.gov/DocumentCenter/View/11692/Stoneham_ZoningBylaw_20260129
