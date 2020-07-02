import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [inputError, setInputError] = useState('');
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) {
      setInputError('Nenhum arquivo foi enviado');
      return;
    }

    const data = new FormData();
    data.append('file', uploadedFiles[0].file);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
      setInputError('');
    } catch (err) {
      setInputError('Falha ao comunicar com a API');
    }
  }

  function submitFile(files: File[]): void {
    const submitedFiles = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles([...uploadedFiles, ...submitedFiles]);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          {inputError && <Error>{inputError}</Error>}
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
