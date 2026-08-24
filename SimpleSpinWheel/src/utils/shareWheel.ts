import type { RefObject } from 'react';
import Share from 'react-native-share';
import type ViewShot from 'react-native-view-shot';

type ShareCaptureOptions = {
  captureRef: RefObject<ViewShot | null>;
  title: string;
  message: string;
};

export async function shareWheelCapture({
  captureRef,
  title,
  message,
}: ShareCaptureOptions): Promise<void> {
  const uri = await captureRef.current?.capture?.();

  if (!uri) {
    throw new Error('Unable to capture wheel image.');
  }

  const shareUrl = uri.startsWith('file://') ? uri : `file://${uri}`;

  await Share.open({
    title,
    message,
    url: shareUrl,
    type: 'image/png',
    failOnCancel: false,
  });
}
