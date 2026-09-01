#!/bin/bash
# Desinstalador de MABRIONA STUDIO (macOS).
# Borra la app de /Applications y todos sus datos locales (caché,
# preferencias, estado guardado) — no toca nada de la cuenta en la nube,
# eso vive en mabriona.com, no en esta Mac.

set -e

APP_NAME="MABRIONA STUDIO"
osascript -e "display dialog \"¿Desinstalar $APP_NAME de esta Mac?\" buttons {\"Cancelar\", \"Desinstalar\"} default button \"Cancelar\" cancel button \"Cancelar\" with icon caution" >/dev/null

rm -rf "/Applications/${APP_NAME}.app"
rm -rf "$HOME/Library/Application Support/${APP_NAME}"
rm -rf "$HOME/Library/Caches/com.mabriona.studio"
rm -rf "$HOME/Library/Saved Application State/com.mabriona.studio.savedState"
rm -f "$HOME/Library/Preferences/com.mabriona.studio.plist"

osascript -e "display notification \"Se borró $APP_NAME y sus datos de esta Mac.\" with title \"Desinstalación completa\""
