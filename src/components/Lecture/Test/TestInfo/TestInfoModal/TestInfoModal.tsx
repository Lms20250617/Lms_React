export const TestInfoModal = () => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const [detail, setDetail] = useState<INtoticeDetail>();
  const [imgaeUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    id && detailNotice();

    return () => {
      setId(0);
    };
  }, []);

  const savaNotice = () => {
    axios
      .post('/api/support/noticeFileSave.do', formRef.current)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('저장 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  const detailNotice = () => {
    const param = new URLSearchParams();

    param.append('noticeId', id.toString());

    axios
      .post('/api/support/noticeFileDetail.do', param)
      .then((res: AxiosResponse<{ detailValue: INtoticeDetail }>) => {
        const { fileExt, logicalPath } = res.data.detailValue;

        if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'gif') {
          setImageUrl('/api' + logicalPath);
        } else {
          setImageUrl('');
        }

        setDetail(res.data.detailValue);
      });
  };

  const updateDetail = () => {
    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('noticeId', id.toString());

    axios
      .post('/api/support/noticeFileUpdate.do', formData)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('수정 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  const deleteDetail = () => {
    const param = new URLSearchParams({ noticeId: id.toString() });

    axios
      .post('/api/support/noticeFileDelete.do', param)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('삭제 되었습니다');
          setModal({ isOpen: false });
          postSuccess();
        }
      });
  };

  const handlerFile = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInfo = e.target.files;

    if (fileInfo?.length) {
      const fileInfoSplit = fileInfo[0].name.split('.');
      const fileExt = fileInfoSplit[1].toLowerCase();

      if (fileExt === 'jpg' || fileExt === 'gif' || fileExt === 'png') {
        setImageUrl(URL.createObjectURL(fileInfo[0]));
      } else {
        setImageUrl('');
      }
    }
  };

  const downloadFile = () => {
    const param = new URLSearchParams();
    param.append('noticeId', id.toString());

    axios
      .post('/api/support/noticeDownload.do', param, {
        responseType: 'blob',
      })
      .then((res: AxiosResponse<Blob>) => {
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', detail?.fileName as string);

        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  return (
    <div className="modal-overlay">
      <form ref={formRef} className="modal-form modal-container">
        <label>
          제목 :
          <input
            type="text"
            name="fileTitle"
            defaultValue={detail?.noticeTitle}
          />
        </label>
        <label>
          내용 :
          <input
            type="text"
            name="fileContent"
            defaultValue={detail?.noticeContent}
          />
        </label>
        파일 :
        <input type="file" id="fileInput" name="file" onChange={handlerFile} />
        <label className="img-label" htmlFor="fileInput">
          파일 첨부하기
        </label>
        <div>
          <div onClick={downloadFile}>
            {imgaeUrl ? (
              <>
                <label>미리보기</label>
                <img className="preview-image" src={imgaeUrl} />
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="button-container">
          <button type="button" onClick={!id ? savaNotice : updateDetail}>
            {!id ? '저장' : '수정'}
          </button>
          {!!id && (
            <button type="button" onClick={deleteDetail}>
              삭제
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setModal({ isOpen: false });
            }}
          >
            나가기
          </button>
        </div>
      </form>
    </div>
  );
};
