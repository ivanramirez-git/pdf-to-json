import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeImage = async (imagePath, pdfName) => {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    //     const prompt = `
    // Cuantas paginas se obtienen de la imagen?
    // Si es una:
    //     Transcribe todo el texto encontrado en la imagen, la imagen contiene una pagina de un libro escaneado.
    //     [
    //         {
    //             "page_number": number,
    //             "chapter_title": string,
    //             "content": string,
    //             "paragraphs": [
    //                 string,
    //                 string
    //             ],
    //             "paragraph_keywords": [
    //                 [string],
    //                 [string]
    //             ],
    //             "page_keywords": [string],
    //             "figures": [string],
    //             "tables": [string],
    //             "book_title": string
    //         }
    //     ]

    // Si es dos:
    //     Transcribe todo el texto encontrado en la imagen, la imagen contiene una o dos paginas de un libro escaneado.
    //     [
    //         {
    //             "page_number": number,
    //             "chapter_title": string,
    //             "content": string,
    //             "paragraphs": [
    //                 string,
    //                 string
    //             ],
    //             "paragraph_keywords": [
    //                 [string],
    //                 [string]
    //             ],
    //             "page_keywords": [string],
    //             "figures": [string],
    //             "tables": [string],
    //             "book_title": string
    //         },
    //         {
    //             "page_number": number,
    //             "chapter_title": string,
    //             "content": string,
    //             "paragraphs": [
    //                 string,
    //                 string
    //             ],
    //             "paragraph_keywords": [
    //                 [string],
    //                 [string]
    //             ],
    //             "page_keywords": [string],
    //             "figures": [string],
    //             "tables": [string],
    //             "book_title": string
    //         }
    //     ]

    // El libro es ${pdfName}.

    // Envolver el resultado en un bloque de código JSON.
    // Maximo 10 keywords por página y 5 por parrafo.
    // Transcribir textualmente todo el texto encontrado en las figuras o tablas para no perder información.
    // `;

    const prompt = `
How many pages are obtained from the image?

If it's one page:
    Transcribe all the text found in the image. The image contains one scanned page from a book.
    Format the output as follows:
    [
        {
            "page_number": <number>,
            "chapter_title": "<string>",
            "content": "<string>",
            "paragraphs": [
                "<string>",
                "<string>"
            ],
            "paragraph_keywords": [
                ["<string>"],
                ["<string>"]
            ],
            "page_keywords": ["<string>"],
            "figures": ["<string>"],
            "tables": ["<string>"],
            "book_title": "<string>"
        }
    ]

If it's two pages:
    Transcribe all the text found in the image. The image contains one or two scanned pages from a book.
    Format the output as follows:
    [
        {
            "page_number": <number>,
            "chapter_title": "<string>",
            "content": "<string>",
            "paragraphs": [
                "<string>",
                "<string>"
            ],
            "paragraph_keywords": [
                ["<string>"],
                ["<string>"]
            ],
            "page_keywords": ["<string>"],
            "figures": ["<string>"],
            "tables": ["<string>"],
            "book_title": "<string>"
        },
        {
            "page_number": <number>,
            "chapter_title": "<string>",
            "content": "<string>",
            "paragraphs": [
                "<string>",
                "<string>"
            ],
            "paragraph_keywords": [
                ["<string>"],
                ["<string>"]
            ],
            "page_keywords": ["<string>"],
            "figures": ["<string>"],
            "tables": ["<string>"],
            "book_title": "<string>"
        }
    ]

The book is titled "${pdfName}".

Wrap the result in a JSON code block.
Include a maximum of 10 keywords per page and 5 keywords per paragraph.
Transcribe all text found in the figures or tables verbatim to avoid losing information.
`;


    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/png;base64,${base64Image}`,
                        },
                    },
                ],
            },
        ],
    });

    return response.choices[0].message.content;
};


