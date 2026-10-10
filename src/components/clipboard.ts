export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Keep the text available when clipboard permission is denied or unsupported.
    window.prompt('Copy this text:', text);
    return false;
  }
}
