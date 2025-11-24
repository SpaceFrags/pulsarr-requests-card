# Pulsarr Requests Card

## 🖼️ Lovelace Card for Streamlined Media Approval

***

## Overview

The **Pulsarr Requests Card** is a custom Lovelace card for Home Assistant, designed to visually display and manage pending media approval requests fetched by the companion custom integration.

It transforms the raw JSON data from the `sensor.pulsarr_enhanced_requests` entity into an attractive, actionable list showing media posters, titles, request details, and most importantly, provides one-click **Approve** and **Reject** buttons by utilizing the integration's service call.

### Key Features

* **Visual Display:** Shows rich metadata including posters, titles, and ratings fetched by the integration.
* **One-Click Actions:** Directly calls the `pulsarr_enhanced_requests.process_request` service to approve or reject items without leaving the dashboard.
* **Real-time Updates:** Requests disappear from the list automatically once processed.
* **Configurable Style:** Allows customization of the title, button colors, and background for seamless integration with your dashboard theme.

### Prerequisites

This card **requires** the custom integration to function:

| Component | Repository |
| :--- | :--- |
| **Backend Integration** | [Pulsarr Enhanced Requests](https://github.com/SpaceFrags/pulsarr_enhanced_requests) |
| **Frontend Card** | **Pulsarr Requests Card (This Repo)** |



***

## Installation

The Pulsarr Requests Card is installed through HACS in the Frontend/Lovelace section, as it is a custom UI element.

### 1. Install the Backend Integration First

You must install the **Pulsarr Enhanced Requests** integration (HACS > Integrations) and configure it first to create the required sensor entity (`sensor.pulsarr_enhanced_requests`).

### 2. Install the Custom Card via HACS (Recommended)

1.  In Home Assistant, navigate to **HACS**.
2.  Go to the **Frontend** tab (or "Lovelace").
3.  Click the **+ Explore & Download Repositories** button.
4.  Search for **"Pulsarr Requests Card"**.
5.  Click **Download** and select the latest version.
6.  HACS should automatically add the required resource entry for the card. If it doesn't, follow the manual resource steps below.

### 3. Manual Resource Configuration (If needed)

If HACS does not automatically add the resource, you need to manually add it to your Lovelace configuration.

1.  Go to **Settings** > **Dashboards** (or "Lovelace Dashboards").
2.  Click the three dots **(⋮)** in the top right and select **"Resources"**.
3.  Click **"Add Resource"** and enter the following details:
    * **URL:** `/hacsfiles/pulsarr-requests-card/pulsarr-requests-card.js`
    * **Resource Type:** `JavaScript Module`

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

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `entity` | `string` | **REQUIRED** | The ID of the integration sensor (`sensor.pulsarr_enhanced_requests`). |
| `show_title` | `boolean` | `true` | Show or hide the card header title. |
| `custom_title` | `string` | `Pulsarr Pending Requests` | Overrides the default title text. |
| `approve_button_color` | `string` | `var(--success-color)` | CSS color value for the Approve button. |
| `reject_button_color` | `string` | `var(--error-color)` | CSS color value for the Reject button. |
| `request_item_background_color` | `string` | `var(--secondary-background-color)` | Background color for individual request cards. |
| `disable_hover_animation` | `boolean` | `false` | If true, disables the slight scale-up animation on mouse hover. |


