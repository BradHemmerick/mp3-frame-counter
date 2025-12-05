import { FRAME_HEADER_SIZE } from './constants.ts';
import { parseFrameHeader } from './frameParser.ts';
import { skipId3v2Tag, getAudioEndOffset } from './id3.ts';

export const countMp3Frames = (buffer: Buffer, debug = false): number => {
  let offset = skipId3v2Tag(buffer);
  let frames = 0;
  const audioEnd = getAudioEndOffset(buffer);

  
  if (debug) {
    console.log(`buffer: ${buffer.length}`);
    console.log(`offset after ID3v2: ${offset}`);
    console.log(`audioEnd: ${audioEnd} \n`);
  }

  while (offset < audioEnd) {
    if (offset + FRAME_HEADER_SIZE > buffer.length) {
      if (debug) console.log(`Not enough bytes for header at offset ${offset}`);
      break;
    }

    const header = parseFrameHeader(buffer, offset);

    if (!header || header.frameLength <= 0) {
      offset += 1;
      continue;
    }

    if (offset + header.frameLength > buffer.length) {
      if (debug) {
        console.log(`frame at offset ${offset} would go past buffer (${offset + header.frameLength} > ${buffer.length})`);
      }
      break;
    }

    frames += 1;

    offset += header.frameLength;
  }

  if (debug) {
    console.log(`frames counted: ${frames}`);
    console.log(`final offset: ${offset}`);
    console.log(`bytes left: ${buffer.length - offset}`);
  }

  return frames;
};