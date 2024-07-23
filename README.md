# PDF to JSON Converter

This project converts PDF pages to images, processes each image with OpenAI to extract text, and generates a JSON file with the metadata of each page.

## Prerequisites

### GraphicsMagick and Ghostscript

#### macOS

1. **Install Homebrew** (if you don't have it already):

   ```sh
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install GraphicsMagick**:

   ```sh
   brew install graphicsmagick
   ```

3. **Install Ghostscript**:

   ```sh
   brew install ghostscript
   ```

#### Ubuntu

1. **Update your package list**:

   ```sh
   sudo apt update
   ```

2. **Install GraphicsMagick**:

   ```sh
   sudo apt install graphicsmagick
   ```

3. **Install Ghostscript**:

   ```sh
   sudo apt install ghostscript
   ```

#### Windows

1. **Download and install GraphicsMagick**:

   - Go to [GraphicsMagick download page](http://www.graphicsmagick.org/download.html) and download the installer.
   - Run the installer and follow the instructions.

2. **Download and install Ghostscript**:

   - Go to [Ghostscript download page](https://www.ghostscript.com/download/gsdnld.html) and download the installer.
   - Run the installer and follow the instructions.

### Node.js and npm

Make sure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

## Installation

1. **Install dependencies**:

   ```sh
   npm install
   ```

2. **Create a `.env` file** in the root directory of your project with the following content:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   ```

   Replace `your_openai_api_key` with your actual OpenAI API key.

## Running the Project

1. **Start the server**:

   ```sh
   npm start
   ```

2. **Open your browser** and navigate to `http://localhost:3000`.

3. **Upload a PDF file** using the provided interface.

## Project Structure

- `src/`
  - `app.js`: Main server file.
  - `routes/`
    - `pdfRoutes.js`: Routes for handling PDF processing.
  - `utils/`
    - `pdfUtils.js`: Utilities for handling PDF to image conversion and processing.
  - `openai.js`: Module for interacting with OpenAI API.

## Example Usage

1. **Upload a PDF file** through the web interface.
2. The server will convert each page of the PDF to an image.
3. Each image is sent to OpenAI for text extraction and processing.
4. The extracted text and metadata are saved into a JSON file in the `data/generated` directory.

## License

This project is licensed under the MIT License.