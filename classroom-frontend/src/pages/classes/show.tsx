import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails } from "@/types";
import { AdvancedImage } from '@cloudinary/react';
import { bannerPhoto } from "@/lib/cloudinary";

const ClassesShow = () => {
    const { query } = useShow<ClassDetails>({ resource: "classes" });

    const classDetails= query.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className='class-view class-show'>
                <ShowViewHeader resource='classes' title='Class Details' />

                <p className='state-message'>
                    {isLoading ? 'Loading class details...'
                        : isError ? 'Failed to load class details...'
                            : 'Class details not found'}
                </p>
            </ShowView>
        );
    }

    const teacherName = classDetails.teacher?.name ?? "Unknown";
    const teacherIntials = teacherName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join(' ');

    const placeholderUrl = `https://palcehold.co/600x400?text=${encodeURIComponent(teacherIntials || 'NA')}`;

    const { } = classDetails

    return (
        <ShowView className='class-view class-show'>
            <ShowViewHeader resource='classes' title="Class Details" />

            <div className='banner'>
                {
                    classDetails.bannerCldPubId
                        ? <AdvancedImage alt="Class Banner" cldImg={bannerPhoto(classDetails.bannerCldPubId , classDetails.name)}></AdvancedImage>
                        : <div className='placeholder'></div>
                }
            </div>


            <Card className="details-card">
{/* Class Details */}
<div>
  <div className="details-header">
    <div>
      <h1>{classDetails.name}</h1>
      <p>{classDetails.description}</p>
    </div>classesDetails

    <div>
      <Badge variant="outline">{classDetails.capacity} spots</Badge>
      <Badge
        variant={
          classDetails.status === "active" ? "default" : "secondary"
        }
        data-status={classDetails.status}
      >
        {(classDetails.status ?? "").toUpperCase()}
      </Badge>
    </div>
  </div>

  <div className="details-grid">
    <div className="instructor">
      <p>Instructor</p>
      <div>
        <img
          src={classDetails.teacher?.image ?? placeholderUrl}
          alt={`${teacherName}'s profile`}
        />

        <div>
          <p>{teacherName}</p>
          <p>{classDetails?.teacher?.email}</p>
        </div>
      </div>
    </div>

    <div className="department">
      <p>Department</p>

      <div>
        <p>{classDetails?.department?.name}</p>
        <p>{classDetails?.department?.description}</p>
      </div>
    </div>
  </div>
</div>

<Separator />

{/* Subject Card */}
<div className="subject">
  <p>Subject</p>

  <div>
    <Badge variant="outline">
      Code: <span>{classDetails?.subject?.code}</span>
    </Badge>
    <p>{classDetails?.subject?.name}</p>
    <p>{classDetails?.subject?.description}</p>
  </div>
</div>

<Separator />

{/* Join Class Section */}
<div className="join">
  <h2>Join Class</h2>

  <ol>
    <li>Ask your teacher for the invite code.</li>
    <li>Click on &quot;Join Class&quot; button.</li>
    <li>Paste the code and click &quot;Join&quot;</li>
  </ol>
</div>

<Button size="lg" className="w-full">
  Join Class
</Button>
</Card>
        </ShowView>
    )
}

export default ClassesShow;