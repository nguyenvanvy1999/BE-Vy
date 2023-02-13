import { Injectable } from '@nestjs/common';
import { v1 } from '@google-cloud/vision';

@Injectable()
export class GoogleVisionService {
  private readonly visionClient: v1.ImageAnnotatorClient;
  constructor() {
    this.visionClient = new v1.ImageAnnotatorClient({
      credentials: {
        type: 'service_account',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCtpUU3bWOqMiFd\n6SQJrNzvitDeQcPMhY5Of2jdbwzOWfIuKsg0iaKU6eCP5ccSNDRulSMwtoRWsBtG\nLqESUqe1qkfSkEDIGnBr2J/j+7Pm4FeLTZEiwxNbev1xB+QpEfmNZE5DdUkoxsCr\nH/RAC+FS8r4xm/sS6q0oUbOg9hTz/MY2fSQaBZBPfUSsO2CL/mZIEOE+dllDq0pw\nmJHR3d62NFWaU9hBITrdrsFq429QEnaH7v4225LuNQRt7yiTKKpveNp1AcnTPq4g\nrbGd7SdmutXFkjUx+ueABFjd2xCmx39VfYbmQWurcWEYI32o0UDf4OTSTcU7/Hxk\ncB7yn4bdAgMBAAECggEAKuQz4KkIgTW4wDWiTTGBsTmctgmQj6g9qm4WPPv9MctN\n4tF2emO04QuUCHc9YOW8PcRg2Nt8fN0rH37NEnWQL3NMIlq3ZbYCJuFvPSUjHtgz\nR5l1TBzbXzFWAOFuHibueVpZaphB5eySErLl5hwJIDANgruAnP+Sne7wa8XdDxbs\nxlblGEfcFoFhq3KtB61atQryU54dEBzf8eS0l1nsLHzXO59kbnCoNOMRFmv9WBr+\nG/fAAF2oJ/mdj3d1MG0QEEL23UjRAHsswyQtqrI43NAakQxLKmlEy28aujCuUc6V\nzGWJcOWdDwdJ4RRl60H4xmU3ixZAwSEJ0dApi5tVEQKBgQDS4OvOeUab+b2Pjei7\nhF0FiMYxCMLOI4uPakIRnaiNO2Rccc+kauCl7QwJCOUruni6B8lIYyCgu2+tg8kg\n9eElDN8qVKpJTHN3JOkD70rgf4jvHn6tYwFoFDLd4dfQYQcystEU+ovk5fGTELZe\nqCEjGgg55I/5TN7zdn5mjOpVTwKBgQDSzOAI6Ri1vJTA3v9T9fGtH5sIyrosthM0\nbxSsrCqiqcvNgPiYEeLbUf/NjN0/aG4N3XwelBFYtjC5pCumM2pN84lx4LXogAXF\nVnarjJqA3I1xe6MOgKfou4X7H0GNBtwTRxafvk5CsnQWg/FX8G7Fhh2GC5H2U2mF\n2Rn2M+kuEwKBgCysscggMTFCC0KqUa/ILtzJSROCQ6LgLOTJIg4RVG/3MR/UjKTM\nb6M3QOF5HPPSoVjn5WCMf5ENpG8iCC4PaQ8sVurk3N6Cb8PB8gt/WmGNIzllQHkD\nDH08KjqPaeUfaSL4dwr2uURY4oDBfaE4BS0miq+ZGFc8Tc9OPyECoXJJAoGABAEq\nXGD5PDKZ7NQPq6unbK+GBXO8d675zGwzy1f182MgYQYLMvBcC+iR4HjFlzfHp3HG\nstoDPlkvscchoSWm5lYzDTvEmOcdtPMAjB++q6YE9dvwbA0bo3s0f2HHoAM6WQ9n\nqZ8242N6excElbQWlqAGnY5ItpI9FfLa4Gd6DYsCgYB6xvVJk4rcIOPJ2NeCWWT9\n3QT1JfBqMbRd4zcbyMkw/KXXA7CrYGR4exPRPvG5SmVwi4PNLyjuTHYBdZ086gDo\nA3wMnQof3uxoviMpBKc+PXg8cQ8nb0D7xCBYLukLYGwGL59VAn06A+Hshg6R6ykK\nkuA1QGlJuczxPraQJERndg==\n-----END PRIVATE KEY-----\n',
        client_email:
          'google-vision-api@credible-rider-376213.iam.gserviceaccount.com',
        client_id: '103752023527778314455',
      },
    });
  }

  public async detectVehicleCode(bufferImage: Buffer) {
    const result = await this.visionClient.textDetection(bufferImage);
    return result[0].textAnnotations;
  }
}
