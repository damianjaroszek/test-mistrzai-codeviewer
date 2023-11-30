import * as path from 'path'; // koniecznie takie importy z * i jak poniżej
import { diskStorage } from 'multer';
import * as mime from 'mime';
import { v4 as uuid } from 'uuid';

export function storageDir() {
  return path.join(__dirname, '../../../storage');
}

export function multerStorage(destination: string) {
  return diskStorage({ // tworzy domyślny sposób zapisu na dysku
    destination: (req, file, callback) => callback(null, destination), // gdzie zapisujemy plik
    filename: (req, file, callback) =>
      callback(null, `${uuid()}.${(mime as any).extensions[file.mimetype]}`), // rozszerzenie pliku dodaj na podstawie mime - czyli zawartości tego co w pliku się znajduje - jeżeli zostanie wrzucona grafika jpg to poprawnie doda takie rozszerzenie a jeżeli pdf to też sobie z tym poradzi - uniwersalnie do wszystkiego
  });
}
