// File: <HA_CONFIG_DIR>/www/community/pulsarr-requests-card/pulsarr-requests-card.js
// Remember to add this file as a Lovelace resource:
// type: module
// url: /local/community/pulsarr-requests-card/pulsarr-requests-card.js

class PulsarrRequestsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null; // Store Home Assistant object
    this._config = {}; // Store card configuration
    this._entityId = ''; // Store the sensor entity ID
  }

  // Set the card configuration
  setConfig(config) {
    if (!config.entity || !config.entity.startsWith('sensor.')) {
      throw new Error('You need to define an entity, e.g., sensor.pulsarr_enhanced_requests');
    }
    this._config = {
      ...config,
      show_title: config.show_title !== false,
      custom_title: config.custom_title || 'Pulsarr Pending Requests',
      approve_button_color: config.approve_button_color || 'var(--success-color, #4CAF50)',
      reject_button_color: config.reject_button_color || 'var(--error-color, #f44336)',
      request_item_background_color: config.request_item_background_color || 'var(--secondary-background-color)',
      disable_hover_animation: config.disable_hover_animation === true
    };
    this._entityId = config.entity;
    this.render(); // Initial render
  }

  // Set the Home Assistant object and update the card
  set hass(hass) {
    this._hass = hass;
    this.render(); // Re-render when HA state changes
  }

  // Render the card content
  render() {
    if (!this._hass || !this._config || !this._entityId) {
      return;
    }

    const stateObj = this._hass.states[this._entityId];
    if (!stateObj) {
      this.shadowRoot.innerHTML = `
        <style>
          .card {
            padding: 16px;
            background-color: var(--card-background-color);
            border-radius: var(--ha-card-border-radius, 12px);
            box-shadow: var(--ha-card-box-shadow, 0px 2px 4px 0px rgba(0,0,0,0.1));
            color: var(--primary-text-color);
            font-family: var(--mdc-typography-headline6-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));
          }
          .warning {
            color: var(--error-color);
          }
        </style>
        <ha-card class="card">
          <div class="warning">Entity '${this._entityId}' not found.</div>
        </ha-card>
      `;
      return;
    }

    // *** FIX: Use the exact attribute name 'pending_requests' as confirmed by the user. ***
    const pendingRequests = stateObj.attributes.pending_requests || [];
    const totalPending = stateObj.state;

    let headerHtml = '';
    if (this._config.show_title) {
      headerHtml = `
        <div class="header">
          <ha-icon icon="mdi:bell-badge"></ha-icon>
          ${this._config.custom_title} (${totalPending})
        </div>
      `;
    }

    let content = `
      <style>
        .card {
          padding: 16px;
          background-color: var(--card-background-color);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0px 2px 4px 0px rgba(0,0,0,0.1));
          color: var(--primary-text-color);
          font-family: var(--mdc-typography-headline6-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));
        }
        .header {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 16px;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header ha-icon {
          color: var(--primary-color);
        }
        .request-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .request-item {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 12px;
          border: 1px solid var(--divider-color);
          border-radius: 8px;
          background-color: ${this._config.request_item_background_color};
          box-shadow: var(--ha-card-box-shadow, 0px 1px 2px 0px rgba(0,0,0,0.05));
          ${this._config.disable_hover_animation ? '' : 'transition: transform 0.2s ease-in-out;'}
        }
        .request-item:hover {
            ${this._config.disable_hover_animation ? '' : 'transform: translateY(-3px);'}
        }
        .request-item.approved {
            opacity: 0.6;
            filter: grayscale(100%);
        }
        .poster {
          width: 80px;
          height: 120px;
          border-radius: 6px;
          object-fit: cover;
          flex-shrink: 0;
          box-shadow: var(--ha-card-box-shadow, 0px 2px 4px 0px rgba(0,0,0,0.1));
        }
        .details {
          flex-grow: 1;
        }
        .title {
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 4px;
          color: var(--text-color);
        }
        .user-type {
          font-size: 0.9em;
          color: var(--secondary-text-color);
          margin-bottom: 8px;
        }
        .ratings {
            display: flex;
            gap: 10px;
            margin-top: 5px;
            font-size: 0.85em;
            color: var(--secondary-text-color);
        }
        .rating-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        .rating-item ha-icon {
            --mdc-icon-size: 16px;
            color: var(--info-color, #2196F3);
        }
        .buttons {
          display: flex;
          gap: 8px;
          margin-top: 10px;
        }
        .button {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s ease;
          flex: 1;
          text-align: center;
          text-transform: uppercase;
        }
        .approve-button {
          background-color: ${this._config.approve_button_color};
          color: white;
        }
        .approve-button:hover {
          background-color: var(--success-color-dark, #45a049);
        }
        .reject-button {
          background-color: ${this._config.reject_button_color};
          color: white;
        }
        .reject-button:hover {
          background-color: var(--error-color-dark, #da190b);
        }
        .no-requests {
          text-align: center;
          color: var(--secondary-text-color);
          padding: 20px;
        }
      </style>
      <ha-card class="card">
        ${headerHtml}
        <div class="request-list">
    `;

    if (pendingRequests.length === 0) {
      content += `<div class="no-requests">No pending requests.</div>`;
    } else {
      pendingRequests.forEach(request => {
        // Data access is simplified to match the flat structure provided in the user's YAML sample.
        const requestTitle = request.title || 'Unknown Title';
        const posterPath = request.poster_path ? 
                           `https://image.tmdb.org/t/p/w185${request.poster_path}` : 
                           `https://placehold.co/80x120/cccccc/333333?text=No+Image`; // Placeholder

        const requestedBy = request.requested_by || 'Unknown User';
        const mediaType = request.media_type || 'Unknown Type';

        // Use 'rating' directly from the request object
        const ratingValue = request.rating !== undefined && request.rating !== null ? 
                           parseFloat(request.rating).toFixed(1) : 'N/A';
        
        // Simplified ratings block
        let ratingsHtml = '';
        if (ratingValue !== 'N/A' && ratingValue !== '0.0') {
            ratingsHtml = `
              <div class="ratings">
                <div class="rating-item">
                  <ha-icon icon="mdi:star"></ha-icon>${ratingValue}
                </div>
              </div>
            `;
        }


        content += `
          <div class="request-item" data-request-id="${request.id}">
            <img class="poster" src="${posterPath}" alt="${requestTitle} Poster">
            <div class="details">
              <div class="title">${requestTitle}</div>
              <div class="user-type">Requested by: ${requestedBy} (${mediaType})</div>
              ${ratingsHtml}
              <div class="buttons">
                <button class="button approve-button" data-action="approve">Approve</button>
                <button class="button reject-button" data-action="reject">Reject</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    content += `
        </div>
      </ha-card>
    `;

    this.shadowRoot.innerHTML = content;
    this.addEventListeners();
  }

  // Add event listeners for the buttons
  addEventListeners() {
    this.shadowRoot.querySelectorAll('.button').forEach(button => {
      button.addEventListener('click', (event) => {
        const requestId = event.target.closest('.request-item').dataset.requestId;
        const action = event.target.dataset.action;
        this.callService(requestId, action);
      });
    });
  }

  // Call the Home Assistant service
  callService(requestId, action) {
    if (!this._hass) {
      console.error('Hass object not available to call service.');
      return;
    }

    // Service call details remain the same
    this._hass.callService('pulsarr_enhanced_requests', 'process_request', {
      request_id: requestId,
      action: action
    }).then(() => {
      console.log(`Service pulsarr_enhanced_requests.process_request called for ID: ${requestId}, Action: ${action}`);
    }).catch(error => {
      console.error('Error calling service:', error);
      this._hass.callService('persistent_notification', 'create', {
        title: 'Pulsarr Request Error',
        message: `Failed to process request ${requestId}: ${error.message || error}`
      });
    });
  }

  // Define the card's dimensions (optional, for Lovelace editor)
  getCardSize() {
    return 3; // Approximate height in Lovelace grid units
  }
}

// Register the custom card
customElements.define('pulsarr-requests-card', PulsarrRequestsCard);
