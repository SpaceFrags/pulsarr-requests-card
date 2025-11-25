# Pulsarr Requests Card

## 🖼️ Lovelace Card for Streamlined Media Approval

***

## Overview

The **Pulsarr Requests Card** is a custom Lovelace card for Home Assistant, designed to visually display and manage pending media approval requests fetched by the companion custom integration and jamcalli's [Pulsarr](https://jamcalli.github.io/Pulsarr/) Real-time Plex watchlist monitoring and content acquisition tool, which Seamlessly sync Plex watchlists with Sonarr and Radarr.

It transforms the raw JSON data from the `sensor.pulsarr_enhanced_requests` entity into an attractive, actionable list showing media posters, titles, request details, and most importantly, provides one-click **Approve** and **Reject** buttons by utilizing the integration's service call.

### Key Features

* **Visual Display:** Shows rich metadata including posters, titles, and ratings fetched by the integration.
* **One-Click Actions:** Directly calls the `pulsarr_enhanced_requests.process_request` service to approve or reject items without leaving the dashboard.
* **Real-time Updates:** Requests disappear from the list automatically once processed.
* **Configurable Style:** Allows customization of the title, button colors, and background for seamless integration with your dashboard theme.

<img width="517" height="564" alt="image" src="https://github.com/user-attachments/assets/861d5c9d-9239-4e34-8fff-09feb4ad1473" />

### Prerequisites

This card **requires** the custom integration to function:

| Component | Repository |
| :--- | :--- |
| **Backend Integration** | [Pulsarr Enhanced Requests](https://github.com/SpaceFrags/pulsarr_enhanced_requests) |
| **Frontend Card** | **Pulsarr Requests Card (This Repo)** |



***

## 🛠 Installation

### Option 1: HACS My Home Assistant (Recommended)

The easiest way to install the Pulsarr Requests Card is via HACS.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=SpaceFrags&repository=pulsarr-requests-card&category=plugin)

### Option 2: Manual HACS Installation

1.  Ensure you have **HACS (Home Assistant Community Store)** installed.
2.  Click the **...** menu in the top right and select **Custom repositories**.
3.  Enter the URL of this GitHub repository and select **Lovelace** as the category.
4.  Click **Add**.
5.  Search for "Pulsarr Requests Card" in the HACS Frontend section and click **Install**.
6.  **Reload** your Home Assistant frontend (a hard refresh `Ctrl+F5` or `Shift+F5` is recommended).

### Option 3: Manual Installation

1.  Download the `pulsarr_requests_card.js` file from the latest release of this repository.
2.  Place the file into your Home Assistant configuration directory under `www/pulsarr_requests_card/`.
    * Path should look like: `/config/www/pulsarr_requests_card/pulsarr_requests_card.js`
3.  Add a resource reference in your Lovelace configuration (via the UI or `ui-lovelace.yaml`):

    **If using the UI:**
    * Go to **Settings** > **Dashboards** > **...** > **Resources**.
    * Click **Add Resource**.
    * **URL:** `/local/pulsarr_requests_card/pulsarr_requests_card.js`
    * **Type:** `JavaScript Module`

***

## Configuration

The card uses the data from the `sensor.pulsarr_enhanced_requests` entity's attributes.

### Basic Card Configuration

Add the card to your Lovelace dashboard via the UI (Search for "Custom: Pulsarr Requests Card") or by using the YAML configuration below:

```yaml
type: custom:pulsarr-requests-card
entity: sensor.pulsarr_enhanced_requests
show_title: true
custom_title: Requests Awaiting Approval
```


### Full Configuration Example (Optional Parameters)

The card offers several optional parameters for customization:

```yaml
type: custom:pulsarr-requests-card
entity: sensor.pulsarr_enhanced_requests
show_title: true
custom_title: Movie & TV Approval Queue
# Optional: Customize Colors
approve_button_color: '#4CAF50'        # Green for success
reject_button_color: '#F44336'         # Red for error
request_item_background_color: '#2b2b2b' # Darker background for each item
# Optional: Animation control
disable_hover_animation: false
```


| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entity` | `string` | **REQUIRED** | The ID of the integration sensor (`sensor.pulsarr_enhanced_requests`). |
| `show_title` | `boolean` | `true` | Show or hide the card header title. |
| `custom_title` | `string` | `Pulsarr Pending Requests` | Overrides the default title text. |
| `approve_button_color` | `string` | `var(--success-color)` | CSS color value for the Approve button. |
| `reject_button_color` | `string` | `var(--error-color)` | CSS color value for the Reject button. |
| `request_item_background_color` | `string` | `var(--secondary-background-color)` | Background color for individual request cards. |
| `disable_hover_animation` | `boolean` | `false` | If true, disables the slight scale-up animation on mouse hover. |


