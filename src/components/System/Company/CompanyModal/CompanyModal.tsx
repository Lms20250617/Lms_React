import { useRecoilState } from 'recoil';
import './styled.css';
import { modalState } from '../../../../stores/modalState';
import { useEffect, useRef, useState, type FC } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import type { Address } from 'react-daum-postcode';
import axios, { type AxiosResponse } from 'axios';
import type { ICompanyDetail } from '../../../../model/System/ICompany';

interface ICompanyProps {
  payload?: { id: number };
  reSearch: () => void;
}

interface IPostResponse {
  result: 'success' | 'fail';
}

export const CompanyModal: FC<ICompanyProps> = ({ payload, reSearch }) => {
  const [_, setModal] = useRecoilState(modalState);
  const formRef = useRef<HTMLFormElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const detailAddressRef = useRef<HTMLInputElement>(null);
  const [detailValue, setDetailValue] = useState<ICompanyDetail>();
  const open = useDaumPostcodePopup();

  useEffect(() => {
    detailCompany();
  }, []);

  const detailCompany = () => {
    const param = new URLSearchParams();
    param.append('companyId', `${payload?.id}`);
    axios
      .post('/api/system/companyDetail.do', param)
      .then((res: AxiosResponse<{ detailValue: ICompanyDetail }>) => {
        console.log(res.data);
        setDetailValue(res.data.detailValue);
      });
  };

  const saveCompany = () => {
    const validation = validationValue();

    if (!validation.isValid) {
      // 에러 메시지 표시
      alert(validation.errors.join('\n'));
      return;
    }

    const formData = new FormData(formRef.current as HTMLFormElement);

    axios
      .post('/api/system/companySave.do', formData)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('저장되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        }
      });
  };

  const updateCompany = () => {
    const validation = validationValue();

    if (!validation.isValid) {
      // 에러 메시지 표시
      alert(validation.errors.join('\n'));
      return;
    }

    const formData = new FormData(formRef.current as HTMLFormElement);
    formData.append('companyId', `${payload?.id}`);

    axios
      .post('/api/system/companyUpdate.do', formData)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('수정되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        }
      });
  };

  const deleteCompany = () => {
    const param = new URLSearchParams();
    param.append('companyId', `${payload?.id}`);
    axios
      .post('/api/system/companyDelete.do', param)
      .then((res: AxiosResponse<IPostResponse>) => {
        if (res.data.result === 'success') {
          alert('삭제되었습니다.');
          setModal({ isOpen: false });
          reSearch();
        }
      });
  };

  const handlerPhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    let value = target.value.replace(/\D/g, '');

    if (value.length <= 11) {
      if (value.length === 11) {
        value = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      } else if (value.length === 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (value.length >= 7) {
        value = value.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
      }

      target.value = value;
    } else {
      target.value = target.value.slice(0, -1);
    }
  };

  const validationValue = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formRef.current) {
      errors.push('폼을 찾을 수 없습니다.');
      return { isValid: false, errors };
    }

    const formData = new FormData(formRef.current);

    const companyName = formData.get('companyName') as string;
    if (!companyName || companyName.trim() === '') {
      errors.push('회사명을 입력해주세요.');
    }

    const companyCeo = formData.get('companyCeo') as string;
    if (!companyCeo || companyCeo.trim() === '') {
      errors.push('대표명을 입력해주세요.');
    }

    const companyHp = formData.get('companyHp') as string;
    if (!companyHp || companyHp.trim() === '') {
      errors.push('휴대전화를 입력해주세요.');
    } else {
      const phoneRegex = /^010-\d{3,4}-\d{4}$/;
      if (!phoneRegex.test(companyHp)) {
        errors.push('휴대전화 형식이 올바르지 않습니다. (예: 010-1234-5678)');
      }
    }

    const companyLoc = formData.get('companyLoc') as string;
    if (!companyLoc || companyLoc.trim() === '') {
      errors.push('우편번호를 입력해주세요.');
    }

    const detailName = formData.get('detailName') as string;
    if (!detailName || detailName.trim() === '') {
      errors.push('기본주소를 입력해주세요.');
    }

    const companyDetailAddress = formData.get('companyDetailAddress') as string;
    if (!companyDetailAddress || companyDetailAddress.trim() === '') {
      errors.push('상세주소를 입력해주세요.');
    }

    const companyEmail = formData.get('companyEmail') as string;
    if (!companyEmail || companyEmail.trim() === '') {
      errors.push('이메일을 입력해주세요.');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(companyEmail)) {
        errors.push('이메일 형식이 올바르지 않습니다.');
      }
    }

    const companyRegDate = formData.get('companyRegDate') as string;
    if (!companyRegDate || companyRegDate.trim() === '') {
      errors.push('가입일자를 입력해주세요.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handlerPostCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    open({
      onComplete: (data: Address) => {
        let addr = '';
        let extraAddr = '';

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr +=
              extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        if (postcodeRef.current) {
          postcodeRef.current.value = data.zonecode;
        }
        if (addressRef.current) {
          addressRef.current.value = addr;
        }
        if (detailAddressRef.current) {
          detailAddressRef.current.focus();
        }
      },
    });
  };
  const convertTimestamp = (timestamp: number | null | undefined) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 10);
  };

  return (
    <div className="company-modal-overlay">
      <div className="company-modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">회사 정보</h2>
        </div>

        <div className="modal-content">
          <div className="plan-section">
            <div className="company-detail-grid">
              <form ref={formRef} className="company-detail-column">
                <div className="company-detail-row">
                  <div className="company-detail-label">
                    회사명<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="text"
                      name="companyName"
                      defaultValue={detailValue?.companyName}
                    ></input>
                  </div>
                </div>

                <div className="company-detail-row">
                  <div className="company-detail-label">
                    대표명<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="text"
                      name="companyCeo"
                      defaultValue={detailValue?.companyCeo}
                    ></input>
                  </div>
                </div>

                <div className="company-detail-row">
                  <div className="company-detail-label">
                    휴대전화<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="text"
                      name="companyHp"
                      onInput={handlerPhoneInput}
                      maxLength={13}
                      defaultValue={detailValue?.companyHp}
                    ></input>
                  </div>
                </div>

                <div className="company-detail-row">
                  <div className="company-detail-label">
                    우편번호<span className="company-required">*</span>
                  </div>
                  <div className="company-post-input-cell">
                    <input
                      type="text"
                      name="companyLoc"
                      ref={postcodeRef}
                      defaultValue={detailValue?.zipcode}
                      readOnly
                    ></input>
                  </div>
                  <button onClick={handlerPostCode} type="button">
                    주소검색
                  </button>
                </div>
                <div className="company-detail-row">
                  <div className="company-detail-label">
                    기본주소<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="text"
                      name="detailName"
                      ref={addressRef}
                      defaultValue={detailValue?.companyLoc}
                      readOnly
                    ></input>
                  </div>
                </div>
                <div className="company-detail-row">
                  <div className="company-detail-label">
                    상세주소<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="text"
                      name="companyDetailAddress"
                      defaultValue={detailValue?.detailAddress}
                      ref={detailAddressRef}
                    ></input>
                  </div>
                </div>
                <div className="company-detail-row">
                  <div className="company-detail-label">
                    이메일<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="email"
                      name="companyEmail"
                      defaultValue={detailValue?.companyEmail}
                    ></input>
                  </div>
                </div>
                <div className="company-detail-row">
                  <div className="company-detail-label">
                    가입일자<span className="company-required">*</span>
                  </div>
                  <div className="company-input-cell">
                    <input
                      type="date"
                      name="companyRegDate"
                      defaultValue={convertTimestamp(
                        detailValue?.companyRegDate as number
                      )}
                    ></input>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="button-container">
            <button
              type="button"
              onClick={!payload?.id ? saveCompany : updateCompany}
            >
              {!payload?.id ? '저장' : '수정'}
            </button>
            {!!payload?.id && (
              <button
                type="button"
                onClick={deleteCompany}
                className="delete-button"
              >
                삭제
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setModal({ isOpen: false });
              }}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
