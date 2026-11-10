import { supportedApiVersion } from './apiVersion'
import { registerHighlight } from './richText'

/**
 * The guest bundle: Studio loads it into the edit-mode preview frame (the
 * `guestJavascript` of this package's plugin entry in Settings.yaml), right
 * after its own guest script, so inline editing gets the same rich text
 * extensions as the inspector.
 */
if (supportedApiVersion('guest.js')) {
  registerHighlight()
}
