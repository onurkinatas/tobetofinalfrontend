import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import lectureService from "../../../services/lectureService";
import { selectLecture } from "../../../store/slices/lectureSlice";
import { fetchLectures } from "../../../utils/fetchalldata";
import Lecture from "../../Lecture/Lecture";
import NoContent from "../../NoContent/NoContent";
import "./LecturesExpandDisplay.css";

function LecturesExpandDisplay() {
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(1);
  const [isSelected, setIsSelected] = useState(0);
  const [clicked, setClicked] = useState(0);
  const [lectures, setLectures] = useState(useSelector(selectLecture));
  const [loading, setLoading] = useState(false);

  const getContinuedLectures = async (pageNumber: number) => {
    setLoading(true);
    const data = await lectureService.getAllLectureContinued(pageNumber, 12);
    setLoading(false);
    setLectures(data.data.items);
    setPageSize(data.data.pages);
  };

  const getComplatedLectures = async (pageNumber: number) => {
    setLoading(true);
    const data = await lectureService.getAllLectureCompletion(pageNumber, 12);
    setLoading(false);
    setLectures(data.data.items);
    setPageSize(data.data.pages);
  };

  const getLectures = async (pageNumber: number) => {
    setLoading(true);
    const data = await lectureService.getAllWithData(pageNumber, 12);
    setLoading(false);
    setLectures(data.items);
    setPageSize(data.pages);
  };

  window.onload = async () => {
    await fetchLectures(dispatch);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    async function getPageSize() {
      const data = await lectureService.getAllWithData(0, 12);
      setPageSize(data.pages);
    }
    getPageSize();
  }, []);

  return (
    <main>
      <div className="lectures-expand">
        <div className="container-fluid">
          <div className="page-banner-card">
            <div className="container">
              <div className="row">
                <strong>Eğitimlerim</strong>
              </div>
            </div>
          </div>
        </div>
        {!lectures.length && clicked != 1 && !loading ? (
          <div className="container-fluid">
            <NoContent content="ders" />
          </div>
        ) : (
          <div className="container-fluid">
            <div className="container filters">
              <ul
                className="nav nav-tabs mainTablist d-flex justify-content-around"
                role="tablist"
              >
                <div className="d-flex flex-wrap justify-content-center">
                  <li className={`nav-item ${clicked === 0 && "is-selectedd"}`}>
                    <button
                      className="filters-link"
                      onClick={() => {
                        setIsSelected(0);
                        setClicked(0);
                        getLectures(0);
                      }}
                    >
                      Tüm Eğitimlerim
                    </button>
                  </li>
                  <li className={`nav-item ${clicked === 1 && "is-selectedd"}`}>
                    <button
                      className="filters-link"
                      onClick={() => {
                        setIsSelected(0);
                        setClicked(1);
                        getContinuedLectures(0);
                      }}
                    >
                      Devam Ettiklerim
                    </button>
                  </li>
                  <li className={`nav-item ${clicked === 2 && "is-selectedd"}`}>
                    <button
                      className="filters-link"
                      onClick={() => {
                        setIsSelected(0);
                        setClicked(2);
                        getComplatedLectures(0);
                      }}
                    >
                      Tamamladıklarım
                    </button>
                  </li>
                </div>
              </ul>
            </div>
            <div className="list container mt-4">
              {loading ? (
                <label>
                  <ClipLoader
                    className="list-loading"
                    color="#9933ff"
                    size={50}
                  />
                </label>
              ) : (
                <>
                  <div className="row list">
                    {lectures.map((lecture: any) => {
                      return <Lecture lecture={lecture} />;
                    })}
                  </div>
                  <div className="pages-control anim-fadein">
                    <ul
                      className="pagination justify-content-center gap-2"
                      role="navigation"
                      aria-label="Pagination"
                    >
                      {Array.from(Array(pageSize).keys()).map((page) => (
                        <li
                          className={
                            isSelected == page
                              ? "li-selected page-item selected-hover"
                              : "page-item item-hover"
                          }
                          onClick={() => {
                            setIsSelected(page);
                            if (clicked === 0) getLectures(page);
                            else if (clicked === 1) getContinuedLectures(page);
                            else getComplatedLectures(page);
                          }}
                        >
                          <a
                            rel="canonical"
                            role="button"
                            className="page-link"
                            aria-current="page"
                          >
                            {page + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default LecturesExpandDisplay;
