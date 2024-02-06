export class FileNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileNotFoundError';
  }
}

export class TextDetectionsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Text Detetction Error';
  }
}
