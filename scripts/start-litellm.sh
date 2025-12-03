#!/bin/bash
# =============================================================================
# LiteLLM Proxy Start Script
# =============================================================================
# Startet den LiteLLM Proxy mit der Fidus Memory Konfiguration
#
# Verwendung:
#   ./scripts/start-litellm.sh              # Standard (8 Workers)
#   ./scripts/start-litellm.sh --workers 4  # Custom Workers
#   ./scripts/start-litellm.sh --debug      # Mit Debug-Logging
# =============================================================================

set -e

# Standardwerte
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CONFIG_FILE="${PROJECT_ROOT}/litellm_config.yaml"
ENV_FILE="${PROJECT_ROOT}/.env"
NUM_WORKERS=8

# .env Datei laden falls vorhanden
if [[ -f "$ENV_FILE" ]]; then
    set -a
    source "$ENV_FILE"
    set +a
fi
DEBUG_MODE=false
PORT=4000

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Hilfe anzeigen
show_help() {
    echo "LiteLLM Proxy Start Script für Fidus Memory"
    echo ""
    echo "Verwendung: $0 [OPTIONEN]"
    echo ""
    echo "Optionen:"
    echo "  -w, --workers NUM    Anzahl der Worker-Prozesse (Standard: 8)"
    echo "  -p, --port PORT      Port für den Proxy (Standard: 4000)"
    echo "  -c, --config FILE    Pfad zur Konfigurationsdatei"
    echo "  -d, --debug          Debug-Modus aktivieren"
    echo "  -h, --help           Diese Hilfe anzeigen"
    echo ""
    echo "Beispiele:"
    echo "  $0                   # Standard-Start mit 8 Workers"
    echo "  $0 --workers 4       # Mit 4 Workers"
    echo "  $0 --debug           # Mit Debug-Logging"
    echo "  $0 -w 16 -p 8080     # 16 Workers auf Port 8080"
}

# Argumente parsen
while [[ $# -gt 0 ]]; do
    case $1 in
        -w|--workers)
            NUM_WORKERS="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        -d|--debug)
            DEBUG_MODE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unbekannte Option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Prüfen ob Konfigurationsdatei existiert
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo -e "${RED}Fehler: Konfigurationsdatei nicht gefunden: $CONFIG_FILE${NC}"
    exit 1
fi

# Prüfen ob litellm installiert ist
if ! command -v litellm &> /dev/null; then
    echo -e "${RED}Fehler: litellm ist nicht installiert${NC}"
    echo "Installiere mit: pip install litellm"
    exit 1
fi

# Prüfen ob API Keys gesetzt sind
echo -e "${BLUE}Prüfe API Keys...${NC}"

if [[ -z "$OPENAI_API_KEY" ]]; then
    echo -e "${YELLOW}⚠ OPENAI_API_KEY nicht gesetzt - OpenAI Modelle nicht verfügbar${NC}"
else
    echo -e "${GREEN}✓ OPENAI_API_KEY gesetzt${NC}"
fi

if [[ -z "$ANTHROPIC_API_KEY" ]]; then
    echo -e "${YELLOW}⚠ ANTHROPIC_API_KEY nicht gesetzt - Claude Modelle nicht verfügbar${NC}"
else
    echo -e "${GREEN}✓ ANTHROPIC_API_KEY gesetzt${NC}"
fi

# LiteLLM Befehl zusammenbauen
LITELLM_CMD="litellm --config \"$CONFIG_FILE\" --num_workers $NUM_WORKERS --port $PORT"

if [[ "$DEBUG_MODE" == true ]]; then
    LITELLM_CMD="$LITELLM_CMD --detailed_debug"
fi

# Starten
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  LiteLLM Proxy für Fidus Memory${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "  Config:   ${BLUE}$CONFIG_FILE${NC}"
echo -e "  Workers:  ${BLUE}$NUM_WORKERS${NC}"
echo -e "  Port:     ${BLUE}$PORT${NC}"
echo -e "  Debug:    ${BLUE}$DEBUG_MODE${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Starte LiteLLM Proxy auf ${BLUE}http://localhost:$PORT${NC}"
echo -e "Swagger UI: ${BLUE}http://localhost:$PORT/ui${NC}"
echo ""

# Ausführen
eval $LITELLM_CMD
