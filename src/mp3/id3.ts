import {  ID3V1_TAG_SIZE, ID3V2_HEADER_SIZE } from './constants.ts';

export const skipId3v2Tag = (buffer: Buffer): number => {
  if (buffer.length < ID3V2_HEADER_SIZE) {
    return 0;
  }

  const b0 = buffer[0];
  const b1 = buffer[1];
  const b2 = buffer[2];
  const b6 = buffer[6];
  const b7 = buffer[7];
  const b8 = buffer[8];
  const b9 = buffer[9];

  if (
    b0 === undefined || b1 === undefined || b2 === undefined ||
    b6 === undefined || b7 === undefined || b8 === undefined || b9 === undefined
  ) {
    return 0;
  }

  if (
    b0 === 0x49 && // 'I'
    b1 === 0x44 && // 'D'
    b2 === 0x33    // '3'
  ) {
    const size =
      ((b6 & 0x7f) << 21) |
      ((b7 & 0x7f) << 14) |
      ((b8 & 0x7f) << 7) |
      (b9 & 0x7f);

    return ID3V2_HEADER_SIZE + size;
  }

  return 0;
};

export const getAudioEndOffset = (buffer: Buffer): number => {
  // check if ID3v1 tag exists at the end, had issue where some compressed mp3 was incorrect due to missing tag
  if (buffer.length >= ID3V1_TAG_SIZE) {
    const tagStart = buffer.length - ID3V1_TAG_SIZE;
    const t0 = buffer[tagStart];
    const t1 = buffer[tagStart + 1];
    const t2 = buffer[tagStart + 2];

    if (
      t0 === 0x54 && // 'T'
      t1 === 0x41 && // 'A'
      t2 === 0x47    // 'G'
    ) {
      return buffer.length - ID3V1_TAG_SIZE;
    }
  }

  return buffer.length;
};