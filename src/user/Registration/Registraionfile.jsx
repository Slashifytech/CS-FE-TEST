import React, { lazy, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectStepper } from "../../Stores/slices/Regslice";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import RegError from "../../components/RegError";
import apiurl from "../../util";
import { clearAdminState } from "../../Stores/slices/Admin";
import AdminDiscardUserPop from "../PopUps/AdminDiscardUser";

// Lazy load the form components
const Form1 = lazy(() => import("./Form1"));
const Form2 = lazy(() => import("./Form2"));
const Form3 = lazy(() => import("./Form3"));
const Form4 = lazy(() => import("./Form4"));
const Form5 = lazy(() => import("./Form5"));
const Form6 = lazy(() => import("./Form6"));
const RegistrationFile = () => {
  const formArray = [1, 2, 3, 4, 5, 6];
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const { currentStep } = useSelector(selectStepper);
  const location = useLocation();
  let { page } = useParams();
  const { admin, userDataAddedByAdmin } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const closeDiscard = () => {
    setIsDiscardOpen(false);
  };
  const OpenDiscard = () => {
    setIsDiscardOpen(true);
  };
  const discardUser = async (userId) => {
    const url = "/discard-user";

    try {
      const response = await apiurl.post(
        url,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localstorage.removeItem("adminState");
      console.log("User discarded successfully:", response.data);
    } catch (error) {
      console.error("Error discarding user:", error);
    }
  };

  const handleDiscardUser = () => {
    discardUser(userDataAddedByAdmin?._id);
    dispatch(clearAdminState());
    navigate("/admin/user");
  };

  return (
    <>
      <div className="bg-white flex justify-center items-center font-montserrat">
        <div className="md:w-[110vh] w-full rounded-md bg-white p-5">
          <div className="flex justify-center items-center">
            {formArray.map((v, i) => (
              <React.Fragment key={i}>
                <div
                  className={`w-[50px] my-3 rounded-full registration mb-8 text-medium ${
                    i <= currentStep - 1
                      ? "text-white background"
                      : "bg-[#FCFCFC] text-black"
                  } md:h-[50px] h-[37px] sm:h-[50px] flex justify-center items-center`}
                >
                  {v}
                </div>
                {i !== formArray.length - 1 && (
                  <div
                    key={`line-${i}`}
                    className={`w-[50px] h-[2px] registration mb-5 ${
                      i <= currentStep - 2 ? "background" : "bg-[#FCFCFC]"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
          {admin === "adminAction" && (
            <span className="flex gap-9 justify-center items-center pb-3 ">
              <Link
                to="/admin/user"
                className="px-3 py-2 bg-primary text-white rounded-md cursor-pointer"
              >
                {" "}
                Back to List
              </Link>
              <span
                className="border border-primary cursor-pointer px-3 py-2 rounded-md text-primary"
                onClick={OpenDiscard}
              >
                Discard User
              </span>
            </span>
          )}
          <Suspense fallback={<div>Loading...</div>}>
            {page === "1" && <Form1 page={page} />}
            {page === "2" && location.state === "passPage" ? (
              <Form2 page={page} />
            ) : (
              page === "2" && <RegError />
            )}
            {page === "3" && location.state === "passPage" ? (
              <Form3 page={page} />
            ) : (
              page === "3" && <RegError />
            )}
            {page === "4" && location.state === "passPage" ? (
              <Form4 page={page} />
            ) : (
              page === "4" && <RegError />
            )}
            {page === "5" && location.state === "passPage" ? (
              <Form5 page={page} />
            ) : (
              page === "5" && <RegError />
            )}
            {page === "6" && location.state === "passPage" ? (
              <Form6 page={page} />
            ) : (
              page === "6" && <RegError />
            )}
          </Suspense>
        </div>
      </div>
      <AdminDiscardUserPop
        closeDiscard={closeDiscard}
        isDiscardOpen={isDiscardOpen}
        handleDiscardUser={handleDiscardUser}
      />
    </>
  );
};

export default RegistrationFile;
